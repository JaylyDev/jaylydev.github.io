import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  isPressable?: boolean;
  onClick?: () => void;
}

export interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

const CARD_BASE =
  "flex flex-col relative overflow-hidden h-auto box-border rounded-[14px] bg-white text-[#11181C] dark:bg-[#18181b] dark:text-[#ECEDEE] shadow-[0_0_15px_0_rgba(0,0,0,0.03),0_2px_30px_0_rgba(0,0,0,0.08),0_0_1px_0_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_0_rgba(0,0,0,0.06),0_2px_30px_0_rgba(0,0,0,0.22),inset_0_0_1px_0_rgba(255,255,255,0.15)]";

export function Card({ children, className = "", isPressable = false, onClick }: CardProps): React.JSX.Element {
  if (isPressable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${CARD_BASE} w-full text-left cursor-pointer transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#006FEE] focus-visible:outline-offset-2 ${className}`}
      >
        {children}
      </button>
    );
  }

  return <div className={`${CARD_BASE} ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardSectionProps): React.JSX.Element {
  return (
    <div className={`flex p-3 z-10 w-full justify-start items-center shrink-0 rounded-t-[14px] ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardSectionProps): React.JSX.Element {
  return (
    <div className={`relative flex flex-1 w-full p-3 flex-auto flex-col break-words text-left ${className}`}>
      {children}
    </div>
  );
}
