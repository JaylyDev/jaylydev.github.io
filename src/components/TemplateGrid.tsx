import React from "react";
import { Card, CardBody, CardHeader, Image, Spinner } from "@heroui/react";

interface Template {
  id: string;
  name: string;
  iconPath: string;
}

interface TemplateGridProps {
  templates: Template[];
  isLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
  isProcessing?: boolean;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  isLoading,
  onTemplateSelect,
  isProcessing = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">No templates available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          isPressable
          onPress={() => !isProcessing && onTemplateSelect(template.id)}
        >
          <CardHeader className="pb-0">
            <div className="w-full aspect-video relative mb-2">
              <Image
                src={template.iconPath}
                alt={template.name}
                className="w-full h-full object-cover rounded-lg"
                fallbackSrc="/bedrock-experiments/assets/default-world-icon.jpeg"
              />
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">{template.name}</h3>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
