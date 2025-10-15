import React from "react";
import { Switch, Chip } from "@heroui/react";

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

interface ExperimentsDisplayProps {
  experimentsData: ExperimentsData | null;
  experiments: ExperimentsState;
  onExperimentToggle: (experimentId: string, enabled: boolean) => void;
}

export const ExperimentsDisplay: React.FC<ExperimentsDisplayProps> = ({
  experimentsData,
  experiments,
  onExperimentToggle,
}) => {
  const groupedExperiments =
    experimentsData?.experiments.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = [];
      }
      acc[exp.category].push(exp);
      return acc;
    }, {} as Record<string, Experiment[]>) || {};

  const enabledCount = Object.values(experiments).filter(Boolean).length;
  const totalCount = experimentsData?.experiments.length || 0;

  if (!experimentsData) {
    return <div className="text-gray-600 dark:text-gray-300">Loading experiments data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Experiment Settings</h3>
        <Chip color="primary" variant="flat">
          {enabledCount}/{totalCount} enabled
        </Chip>
      </div>

      <p className="text-gray-700 dark:text-gray-300">
        Available experimental features for Minecraft {experimentsData.minecraft_version}
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
                  isSelected={experiments[experiment.id] || false}
                  onValueChange={(enabled) => onExperimentToggle(experiment.id, enabled)}
                  color="primary"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
