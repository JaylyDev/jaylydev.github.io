import React from "react";

export type SwitchColor = "default" | "primary" | "success" | "warning";
export type SwitchSize = "sm" | "md";

export interface SwitchProps {
  isSelected?: boolean;
  onValueChange?: (isSelected: boolean) => void;
  color?: SwitchColor;
  size?: SwitchSize;
  isDisabled?: boolean;
  ariaLabel?: string;
}

const ACTIVE_COLOR_CLASSES: Record<SwitchColor, string> = {
  default: "bg-[#a1a1aa] dark:bg-[#71717a]",
  primary: "bg-[#006FEE]",
  success: "bg-[#17c964]",
  warning: "bg-[#f5a524]",
};

const TRACK_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: "w-10 h-6",
  md: "w-12 h-7",
};

const THUMB_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
};

const THUMB_TRANSLATE_CLASSES: Record<SwitchSize, string> = {
  sm: "translate-x-4",
  md: "translate-x-5",
};

export function Switch({
  isSelected = false,
  onValueChange,
  color = "primary",
  size = "md",
  isDisabled = false,
  ariaLabel,
}: SwitchProps): React.JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isSelected}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={() => onValueChange?.(!isSelected)}
      className={[
        "relative inline-flex shrink-0 items-center rounded-full px-1 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006FEE] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        TRACK_SIZE_CLASSES[size],
        isSelected ? ACTIVE_COLOR_CLASSES[color] : "bg-[#e4e4e7] dark:bg-[#3f3f46]",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block rounded-full bg-white shadow transition-transform duration-150",
          THUMB_SIZE_CLASSES[size],
          isSelected ? THUMB_TRANSLATE_CLASSES[size] : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
