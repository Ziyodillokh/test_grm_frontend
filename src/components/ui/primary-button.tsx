import * as React from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  /** Label matn — children sifatida ham yuborish mumkin */
  label?: React.ReactNode;
}

/**
 * Ko'k bg, oq icon (18×18) + text (15px medium) bilan asosiy action button.
 * Loyiha bo'yicha "Qo'shish", "Saqlash", "Filterni tozalash" kabi primary harakat tugmalari uchun.
 *
 * Misol:
 *   <PrimaryButton icon={<Plus className="w-[18px] h-[18px]" />}>Qo'shish</PrimaryButton>
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ icon, label, children, className, type = "button", ...rest }, ref) => {
    const content = label ?? children;
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "h-[42px] inline-flex items-center gap-[8px] px-[16px] rounded-[6px]",
          "bg-[#0078d4] text-white text-[15px] font-medium",
          "hover:bg-[#0066b3] transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {icon && (
          <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0 [&_svg]:w-[18px] [&_svg]:h-[18px]">
            {icon}
          </span>
        )}
        {content && <span className="leading-none">{content}</span>}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
