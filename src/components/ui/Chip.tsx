import React from "react";

export type ChipColor = "primary" | "warning";
export type ChipSize = "sm" | "md";

export interface ChipProps {
  children: React.ReactNode;
  color?: ChipColor;
  size?: ChipSize;
  className?: string;
}

const COLOR_CLASSES: Record<ChipColor, string> = {
  primary: "bg-[#006FEE]/20 text-[#005bc4] dark:text-[#338ef7]",
  warning: "bg-[#f5a524]/20 text-[#936316] dark:text-[#f5a524]",
};

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: "px-2 h-6 text-xs",
  md: "px-3 h-7 text-sm",
};

export function Chip({ children, color = "primary", size = "md", className = "" }: ChipProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full whitespace-nowrap font-normal ${SIZE_CLASSES[size]} ${COLOR_CLASSES[color]} ${className}`}
    >
      {children}
    </span>
  );
}
