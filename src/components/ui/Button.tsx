import React from "react";

export type ButtonColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
export type ButtonVariant = "solid" | "flat" | "light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "sm" | "md" | "lg" | "full";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  isLoading?: boolean;
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 min-w-16 h-8 text-xs gap-2",
  md: "px-4 min-w-20 h-10 text-sm gap-2",
  lg: "px-6 min-w-24 h-12 text-base gap-3",
};

const DEFAULT_RADIUS_BY_SIZE: Record<ButtonSize, ButtonRadius> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const RADIUS_CLASSES: Record<ButtonRadius, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-[14px]",
  full: "rounded-full",
};

const VARIANT_COLOR_CLASSES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    default: "bg-[#d4d4d8] text-black hover:bg-[#d4d4d8]/80 dark:bg-[#3f3f46] dark:text-white dark:hover:bg-[#3f3f46]/80",
    primary: "bg-[#006FEE] text-white hover:bg-[#006FEE]/85",
    secondary: "bg-[#7828c8] text-white hover:bg-[#7828c8]/85 dark:bg-[#9353d3] dark:hover:bg-[#9353d3]/85",
    success: "bg-[#17c964] text-black hover:bg-[#17c964]/85",
    warning: "bg-[#f5a524] text-black hover:bg-[#f5a524]/85",
    danger: "bg-[#f31260] text-white hover:bg-[#f31260]/85",
  },
  flat: {
    default: "bg-[#d4d4d8]/40 text-[#3f3f46] hover:bg-[#d4d4d8]/60 dark:bg-[#3f3f46]/40 dark:text-[#e4e4e7] dark:hover:bg-[#3f3f46]/60",
    primary: "bg-[#006FEE]/20 text-[#005bc4] hover:bg-[#006FEE]/30 dark:text-[#338ef7]",
    secondary: "bg-[#7828c8]/20 text-[#6020a0] hover:bg-[#7828c8]/30 dark:bg-[#9353d3]/20 dark:text-[#ae7ede]",
    success: "bg-[#17c964]/20 text-[#0e793c] hover:bg-[#17c964]/30 dark:text-[#17c964]",
    warning: "bg-[#f5a524]/20 text-[#936316] hover:bg-[#f5a524]/30 dark:text-[#f5a524]",
    danger: "bg-[#f31260]/20 text-[#c20e4d] hover:bg-[#f31260]/30 dark:text-[#f54180]",
  },
  light: {
    default: "bg-transparent text-black hover:bg-[#d4d4d8]/40 dark:text-white dark:hover:bg-[#3f3f46]/40",
    primary: "bg-transparent text-[#006FEE] hover:bg-[#006FEE]/20",
    secondary: "bg-transparent text-[#7828c8] hover:bg-[#7828c8]/20 dark:text-[#9353d3]",
    success: "bg-transparent text-[#17c964] hover:bg-[#17c964]/20",
    warning: "bg-transparent text-[#f5a524] hover:bg-[#f5a524]/20",
    danger: "bg-transparent text-[#f31260] hover:bg-[#f31260]/20",
  },
  ghost: {
    default: "border-2 border-[#d4d4d8] bg-transparent text-black hover:bg-[#d4d4d8] dark:border-[#3f3f46] dark:text-white dark:hover:bg-[#3f3f46]",
    primary: "border-2 border-[#006FEE] bg-transparent text-[#006FEE] hover:bg-[#006FEE] hover:text-white",
    secondary: "border-2 border-[#7828c8] bg-transparent text-[#7828c8] hover:bg-[#7828c8] hover:text-white",
    success: "border-2 border-[#17c964] bg-transparent text-[#17c964] hover:bg-[#17c964] hover:text-black",
    warning: "border-2 border-[#f5a524] bg-transparent text-[#f5a524] hover:bg-[#f5a524] hover:text-black",
    danger: "border-2 border-[#f31260] bg-transparent text-[#f31260] hover:bg-[#f31260] hover:text-white",
  },
};

export function Button({
  color = "default",
  variant = "solid",
  size = "md",
  radius,
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps): React.JSX.Element {
  const resolvedRadius = radius ?? DEFAULT_RADIUS_BY_SIZE[size];
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center box-border select-none whitespace-nowrap min-w-max font-normal subpixel-antialiased cursor-pointer transition-all duration-150 active:scale-[0.97] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#006FEE] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        SIZE_CLASSES[size],
        RADIUS_CLASSES[resolvedRadius],
        VARIANT_COLOR_CLASSES[variant][color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

export function ButtonGroup({ children, className = "" }: ButtonGroupProps): React.JSX.Element {
  return (
    <div
      role="group"
      className={`inline-flex items-center justify-center [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none ${className}`}
    >
      {children}
    </div>
  );
}
