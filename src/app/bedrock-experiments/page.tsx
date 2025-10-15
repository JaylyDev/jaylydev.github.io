"use client";
import "@/styles/articles.css";
import React, { memo, useEffect, useState, useCallback } from "react";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { Button, Card, CardBody, CardHeader, Switch, Input, Divider, Chip, HeroUIProvider } from "@heroui/react";
import JSZip from "jszip";
import { Int8, ByteTag, Tag, read, write } from "nbtify";
import { ThemeProvider } from "next-themes";
import { InArticleAdUnit } from "@/components/AdUnit";

interface Experiment {
  // The id of the experiment - must match the id in level.dat file
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
  [key: string]: ByteTag; // 0 for disabled, 1 for enabled
  experiments_ever_used: ByteTag;
  saved_with_toggled_experiments: ByteTag;
}

interface WorldLevelDat {
  experiments: Experiments;
  [key: string]: Tag;
}

const ExperimentsEditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [experiments, setExperiments] = useState<ExperimentsState>({});
  const [zip, setZip] = useState<JSZip | null>(null);
  const [levelDat, setLevelDat] = useState<WorldLevelDat | null>(null);
  const [originalLevelDat, setOriginalLevelDat] = useState<ArrayBuffer | null>(null);
  const [experimentsData, setExperimentsData] = useState<ExperimentsData | null>(null);
  const [worldPath, setWorldPath] = useState<string>(""); // Path to world folder (empty for root)

  // Load experiments data
  useEffect(() => {
    fetch("/api/bedrock-experiments/experiments.json")
      .then((response) => response.json())
      .then((data) => setExperimentsData(data))
      .catch((error) => console.error("Failed to load experiments data:", error));
  }, []);

  const groupedExperiments =
    experimentsData?.experiments.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = [];
      }
      acc[exp.category].push(exp);
      return acc;
    }, {} as Record<string, Experiment[]>) || {};

  // Parse NBT experiments from level.dat
  const parseExperimentsFromNBT = async (buffer: ArrayBuffer): Promise<ExperimentsState> => {
    try {
      console.log("Parsing NBT data, buffer size:", buffer.byteLength);
      const parsed = await read<WorldLevelDat>(buffer);
      const levelData = parsed.data;

      console.log("NBT parsed successfully, root keys:", Object.keys(levelData));

      const experimentsState: ExperimentsState = {};

      // Extract experiments from NBT data
      if (levelData.experiments) {
        const experimentsCompound = levelData.experiments;
        console.log("Found experiments compound with keys:", Object.keys(experimentsCompound));

        // Get individual experiment flags
        experimentsData?.experiments.forEach((exp) => {
          if (experimentsCompound[exp.id]) experimentsState[exp.id] = experimentsCompound[exp.id].valueOf() === 1;
          else experimentsState[exp.id] = false;
        });
      } else {
        console.log("No experiments compound found in NBT data, initializing empty experiments");
      }

      console.log("Parsed experiments state:", experimentsState);
      return experimentsState;
    } catch (error) {
      console.error("Error parsing NBT:", error);
      return {};
    }
  };

  // Create a modified NBT buffer with new experiments
  const createModifiedNBT = async (
    originalBuffer: ArrayBuffer,
    newExperiments: ExperimentsState
  ): Promise<ArrayBuffer> => {
    try {
      console.log("Creating modified NBT with experiments:", newExperiments);
      const parsed = await read<WorldLevelDat>(originalBuffer);
      const levelData = parsed.data;

      // Ensure experiments compound exists
      if (!levelData.experiments) {
        console.log("Creating new experiments compound");
        levelData.experiments = {
          experiments_ever_used: new Int8(0),
          saved_with_toggled_experiments: new Int8(0),
        };
      }

      // Calculate enabled experiments count
      const enabledCount = Object.values(newExperiments).filter(Boolean).length;

      // Update experiment flags
      levelData.experiments.experiments_ever_used = new Int8(enabledCount > 0 ? 1 : 0);
      levelData.experiments.saved_with_toggled_experiments = new Int8(enabledCount > 0 ? 1 : 0);

      // Update individual experiment flags
      experimentsData?.experiments.forEach((exp) => {
        const value = newExperiments[exp.id] === true ? 1 : 0;
        levelData.experiments[exp.id] = new Int8(value);
        console.log(`Set experiment ${exp.id} to ${value}`);
      });

      console.log("Writing modified NBT data");
      // Write modified NBT back to buffer
      const modifiedBuffer = await write(parsed, { endian: "little" });
      console.log("NBT modification complete, new buffer size:", modifiedBuffer.length);
      return modifiedBuffer.buffer as ArrayBuffer;
    } catch (error) {
      console.error("Error creating modified NBT:", error);
      throw new Error("Failed to create modified NBT data");
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Check file extension - support both .mcworld and .zip files
    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith(".mcworld") && !fileName.endsWith(".zip")) {
      setError("Please upload a .mcworld or .zip file only.");
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();

      // Check if it's a valid zip file
      const zipFile = new JSZip();
      const loadedZip = await zipFile.loadAsync(arrayBuffer);
      setZip(loadedZip);

      // Look for level.dat file - first in root, then in the first folder
      let levelDatFile = loadedZip.file("level.dat");
      let worldPath = ""; // Empty for root, or "folder/" for subfolder

      console.log("Checking for level.dat in root:", levelDatFile ? "found" : "not found");

      if (!levelDatFile) {
        // If not in root, look for level.dat in folders
        const allEntries = Object.keys(loadedZip.files);
        console.log("All zip entries:", allEntries);

        // Method 1: Look for any level.dat file in the zip
        const levelDatEntries = allEntries.filter((name) => name.endsWith("level.dat"));
        console.log("Found level.dat files:", levelDatEntries);

        if (levelDatEntries.length > 0) {
          const levelDatPath = levelDatEntries[0];
          const pathParts = levelDatPath.split("/");

          if (pathParts.length > 1) {
            // level.dat is in a subfolder
            worldPath = pathParts.slice(0, -1).join("/") + "/";
            levelDatFile = loadedZip.file(levelDatPath);
            console.log(`Found level.dat at: ${levelDatPath}, using world path: ${worldPath}`);
          }
        }

        // Method 2: If still not found, look for top-level folders and check each one
        if (!levelDatFile) {
          const topLevelFolders = allEntries.filter((name) => {
            const file = loadedZip.files[name];
            return file.dir && !name.includes("/", name.length - 1); // Folder at root level
          });

          console.log("Top-level folders found:", topLevelFolders);

          for (const folder of topLevelFolders) {
            const testPath = `${folder}level.dat`;
            const testFile = loadedZip.file(testPath);
            if (testFile) {
              worldPath = folder;
              levelDatFile = testFile;
              console.log(`Found level.dat in folder: ${folder}`);
              break;
            }
          }
        }

        console.log(
          "Final result - Using world path:",
          worldPath,
          levelDatFile ? "level.dat found" : "level.dat not found"
        );

        if (!levelDatFile) {
          throw new Error("No level.dat file found in the .mcworld file");
        }
      }

      // Store the world path for later use
      setWorldPath(worldPath);

      // Read level.dat as ArrayBuffer
      const levelDatBuffer = await levelDatFile.async("arraybuffer");
      setOriginalLevelDat(levelDatBuffer);

      // Parse experiments (simplified approach)
      const parsedExperiments = await parseExperimentsFromNBT(levelDatBuffer);
      setExperiments(parsedExperiments);

      // Calculate enabled experiments count for initial state
      const initialEnabledCount = Object.values(parsedExperiments).filter(Boolean).length;

      setLevelDat({
        experiments: {
          ...parsedExperiments,
          experiments_ever_used: new Int8(initialEnabledCount > 0 ? 1 : 0),
          saved_with_toggled_experiments: new Int8(initialEnabledCount > 0 ? 1 : 0),
        },
      });
      setSuccess("Successfully loaded world and extracted level.dat");
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleExperimentToggle = useCallback((experimentId: string, enabled: boolean) => {
    setExperiments((prev) => ({
      ...prev,
      [experimentId]: enabled,
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!originalLevelDat || !zip) {
      setError("No level data available to modify");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create modified NBT data
      const modifiedNBT = await createModifiedNBT(originalLevelDat, experiments);

      // Update the zip file with new level.dat
      zip.file(`${worldPath}level.dat`, modifiedNBT);

      // Generate new zip file
      const updatedZipBlob = await zip.generateAsync({ type: "blob" });

      // Create download link
      const url = URL.createObjectURL(updatedZipBlob);
      const link = document.createElement("a");
      link.href = url;

      // Always save as .mcworld regardless of input file type
      let downloadName = "modified_world.mcworld";
      if (file?.name) {
        const baseName = file.name.replace(/\.(mcworld|zip)$/i, "");
        downloadName = `${baseName}_modified.mcworld`;
      }
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess("Successfully created modified .mcworld file with updated experiments!");
    } catch (err) {
      setError(`Error creating modified file: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [originalLevelDat, zip, experiments, file, worldPath]);

  const enabledCount = Object.values(experiments).filter(Boolean).length;
  const totalCount = experimentsData?.experiments.length || 0;

  return (
    <HeroUIProvider>
      <ThemeProvider>
        <div className="max-w-4xl mx-auto px-6">
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Minecraft Bedrock Experiments Editor (Beta)
              </h1>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This tool allows you to modify experimental features in your Minecraft Bedrock world.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Upload a .mcworld or .zip file to enable or disable experimental features in your Minecraft Bedrock
                world. This tool will parse the level.dat file using NBT format and modify the experiments compound tag.
              </p>

              <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 p-3 rounded">
                <strong>How it works:</strong> This tool extracts the level.dat file from your world file (.mcworld or
                .zip), parses the NBT data structure, modifies the experiments compound tag, and creates a new .mcworld
                file with your selected experimental features enabled or disabled.
              </div>

              <Input
                type="file"
                accept=".mcworld,.zip"
                onChange={handleFileUpload}
                disabled={isProcessing}
                label="Select .mcworld or .zip file"
                placeholder="Choose your world file..."
                className="dark:text-white"
              />

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded">
                  {success}
                </div>
              )}

              {isProcessing && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 rounded">
                  Processing file...
                </div>
              )}
            </CardBody>
          </Card>

          {levelDat && (
            <Card className="dark:bg-gray-900">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Experiment Settings</h3>
                <Chip color="primary" variant="flat">
                  {enabledCount}/{totalCount} enabled
                </Chip>
              </CardHeader>
              <CardBody className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Available experimental features for Minecraft {experimentsData?.minecraft_version}
                </p>

                {Object.entries(groupedExperiments).map(([category, categoryExperiments]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-lg border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-900 dark:text-white">
                      {category}
                    </h4>
                    <div className="grid gap-3">
                      {categoryExperiments.map((experiment) => (
                        <div
                          key={experiment.id}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">{experiment.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{experiment.description}</p>
                            <code className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                              {experiment.id}
                            </code>
                          </div>
                          <Switch
                            isSelected={experiments[experiment.id]}
                            onValueChange={(enabled) => handleExperimentToggle(experiment.id, enabled)}
                            color="primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Divider className="dark:border-gray-700" />

                <div className="flex justify-center">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={handleDownload}
                    disabled={isProcessing}
                    className="min-w-48"
                  >
                    {isProcessing ? "Processing..." : "Download Modified World"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </ThemeProvider>
    </HeroUIProvider>
  );
};

export default function Post(): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader />
        <InArticleAdUnit />
        <ExperimentsEditor />
        <SiteFooter />
      </body>
    </html>
  );
}
