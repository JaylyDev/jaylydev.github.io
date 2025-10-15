"use client";
import "@/styles/articles.css";
import React, { useEffect, useState, useCallback } from "react";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { Button, Card, CardBody, CardHeader, HeroUIProvider, Divider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { TemplateGrid } from "@/components/TemplateGrid";
import { ExperimentsDisplay } from "@/components/ExperimentsDisplay";
import JSZip from "jszip";
import { Int8, LongTag, ByteTag, Tag, read, write } from "nbtify";
import { InArticleAdUnit } from "@/components/AdUnit";

interface Template {
  id: string;
  name: string;
  iconPath: string;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ExperimentsData {
  minecraft_version: string;
  experiments: Experiment[];
}

interface ExperimentsState extends Record<string, boolean> {}

interface Experiments {
  [key: string]: ByteTag;
  experiments_ever_used: ByteTag;
  saved_with_toggled_experiments: ByteTag;
}

interface WorldLevelDat {
  experiments: Experiments;
  RandomSeed: LongTag;
  [key: string]: Tag;
}

const StartFromTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateZip, setTemplateZip] = useState<JSZip | null>(null);
  const [originalLevelDat, setOriginalLevelDat] = useState<ArrayBuffer | null>(null);
  const [experiments, setExperiments] = useState<ExperimentsState>({});
  const [experimentsData, setExperimentsData] = useState<ExperimentsData | null>(null);
  const router = useRouter();

  // Load experiments data
  useEffect(() => {
    fetch("/api/bedrock-experiments/experiments.json")
      .then((response) => response.json())
      .then((data) => setExperimentsData(data))
      .catch((error) => console.error("Failed to load experiments data:", error));
  }, []);

  // Load available templates (client-side)
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateNames = [
          "Default",
          "ClassicFlat",
          "BottomlessPit",
          "Desert",
          "Overworld",
          "RedstoneReady",
          "SnowyKingdom",
          "TheVoid",
          "TunnelersDream",
          "WaterWorld",
        ];

        const templatePromises = templateNames.map(async (templateId) => {
          try {
            const response = await fetch(`/bedrock-experiments/templates/${templateId}/levelname.txt`);
            if (response.ok) {
              const name = (await response.text()).trim();
              return {
                id: templateId,
                name: name,
                iconPath: `/bedrock-experiments/templates/${templateId}/world_icon.jpeg`,
              };
            }
            return null;
          } catch (error) {
            console.error(`Failed to load template ${templateId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(templatePromises);
        const validTemplates = results.filter(Boolean) as Template[];
        setTemplates(validTemplates);
      } catch (error) {
        console.error("Error loading templates:", error);
        setError("Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Parse NBT experiments from level.dat
  const parseExperimentsFromNBT = async (buffer: ArrayBuffer): Promise<ExperimentsState> => {
    try {
      const parsed = await read<WorldLevelDat>(buffer);
      const levelData = parsed.data;

      const experimentsState: ExperimentsState = {};

      if (levelData.experiments) {
        const experimentsCompound = levelData.experiments;
        experimentsData?.experiments.forEach((exp) => {
          if (experimentsCompound[exp.id]) {
            experimentsState[exp.id] = experimentsCompound[exp.id].valueOf() === 1;
          } else {
            experimentsState[exp.id] = false;
          }
        });
      }

      return experimentsState;
    } catch (error) {
      console.error("Error parsing NBT:", error);
      return {};
    }
  };

  // Create a modified NBT buffer with new experiments
  const createModifiedNBT = useCallback(
    async (originalBuffer: ArrayBuffer, newExperiments: ExperimentsState): Promise<ArrayBuffer> => {
      try {
        const parsed = await read<WorldLevelDat>(originalBuffer);
        const levelData = parsed.data;

        if (!levelData.experiments) {
          levelData.experiments = {
            experiments_ever_used: new Int8(0),
            saved_with_toggled_experiments: new Int8(0),
          };
        }

        const enabledCount = Object.values(newExperiments).filter(Boolean).length;
        levelData.experiments.experiments_ever_used = new Int8(enabledCount > 0 ? 1 : 0);
        levelData.experiments.saved_with_toggled_experiments = new Int8(enabledCount > 0 ? 1 : 0);

        experimentsData?.experiments.forEach((exp) => {
          const value = newExperiments[exp.id] === true ? 1 : 0;
          levelData.experiments[exp.id] = new Int8(value);
        });

        levelData.RandomSeed = BigInt.asIntN(
          64,
          BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) *
            BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
        );

        const modifiedBuffer = await write(parsed, { endian: "little" });
        return modifiedBuffer.buffer as ArrayBuffer;
      } catch (error) {
        console.error("Error creating modified NBT:", error);
        throw new Error("Failed to create modified NBT data");
      }
    },
    [experimentsData]
  );

  const handleTemplateSelect = async (templateId: string) => {
    if (!experimentsData) {
      setError("Experiments data not loaded yet");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error("Template not found");
      }

      // Load the template's level.dat file
      const levelDatResponse = await fetch(`/bedrock-experiments/templates/${templateId}/level.dat`);
      if (!levelDatResponse.ok) {
        throw new Error("Failed to load template level.dat");
      }

      const levelDatBuffer = await levelDatResponse.arrayBuffer();
      setOriginalLevelDat(levelDatBuffer);

      // Parse experiments from the template
      const parsedExperiments = await parseExperimentsFromNBT(levelDatBuffer);
      setExperiments(parsedExperiments);

      // Create a zip with the template data
      const zip = new JSZip();
      zip.file("level.dat", levelDatBuffer);
      setTemplateZip(zip);

      setSelectedTemplate(template);
      setSuccess(`Template "${template.name}" loaded successfully! You can now modify the experiments.`);
    } catch (error) {
      console.error("Error loading template:", error);
      setError(`Failed to load template: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExperimentToggle = useCallback((experimentId: string, enabled: boolean) => {
    setExperiments((prev) => ({
      ...prev,
      [experimentId]: enabled,
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!originalLevelDat || !templateZip || !selectedTemplate) {
      setError("No template data available");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const modifiedNBT = await createModifiedNBT(originalLevelDat, experiments);
      const worldTemplateResponse = await fetch("/bedrock-experiments/assets/world_template.zip");
      if (!worldTemplateResponse.ok) {
        throw new Error("Failed to load world template zip");
      }
      const worldTemplateBlob = await worldTemplateResponse.blob();
      const worldTemplateZip = await JSZip.loadAsync(worldTemplateBlob);

      templateZip.file("level.dat", modifiedNBT);
      templateZip.file("levelname.txt", selectedTemplate.name);
      templateZip.file(
        "world_icon.jpeg",
        fetch(selectedTemplate.iconPath).then((res) => res.blob())
      );
      worldTemplateZip.forEach((relativePath, file) => {
        templateZip.file(relativePath, file.async("arraybuffer"));
      });

      const updatedZipBlob = await templateZip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(updatedZipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedTemplate.name.replace(/[^a-zA-Z0-9]/g, "_")}_modified.mcworld`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess("Successfully created modified .mcworld file with updated experiments!");
    } catch (error) {
      setError(`Error creating modified file: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [originalLevelDat, templateZip, experiments, selectedTemplate, experimentsData]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Start from Template</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {!selectedTemplate
              ? "Choose a world template to start editing experiments"
              : `Editing experiments for ${selectedTemplate.name}`}
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>
        )}

        {!selectedTemplate ? (
          <Card className="dark:bg-gray-900 mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Choose a Template</h2>
            </CardHeader>
            <CardBody>
              <TemplateGrid
                templates={templates}
                isLoading={isLoading}
                onTemplateSelect={handleTemplateSelect}
                isProcessing={isProcessing}
              />
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="dark:bg-gray-900">
              <CardHeader className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Template: {selectedTemplate.name}
                </h2>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setSelectedTemplate(null);
                    setTemplateZip(null);
                    setOriginalLevelDat(null);
                    setExperiments({});
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={isProcessing}
                >
                  Choose Different Template
                </Button>
              </CardHeader>
              <CardBody>
                <ExperimentsDisplay
                  experimentsData={experimentsData}
                  experiments={experiments}
                  onExperimentToggle={handleExperimentToggle}
                />
              </CardBody>
            </Card>

            <div className="flex justify-center gap-4">
              <Button color="primary" size="lg" onPress={handleDownload} disabled={isProcessing || !originalLevelDat}>
                {isProcessing ? "Creating World..." : "Download Modified World"}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button
            className="text-lg"
            variant="ghost"
            onPress={() => router.push("/bedrock-experiments")}
            disabled={isProcessing}
          >
            Back to Experiments Editor
          </Button>
        </div>
      </div>
    </main>
  );
};

export default function Page(): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader />
        <InArticleAdUnit />
        <HeroUIProvider>
          <ThemeProvider>
            <StartFromTemplate />
          </ThemeProvider>
        </HeroUIProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
