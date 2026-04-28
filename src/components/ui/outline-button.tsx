import * as React from "react";
import { cn } from "@/lib/utils";

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  /** Label matn — children sifatida ham yuborish mumkin */
  label?: React.ReactNode;
}

/**
 * Outline-style action button — bg oq, border #E7EBF0, ko'k matn va icon, hover'da border ko'k.
 * Reusable: "+ Qo'shish", "Excel fayl import qilish" va shunga o'xshash secondary harakatlar.
 *
 * Misol:
 *   <OutlineButton icon={<Plus className="w-[16px] h-[16px]" />}>Qo'shish</OutlineButton>
 */
export const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ icon, label, children, className, type = "button", ...rest }, ref) => {
    const content = label ?? children;
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "h-[42px] inline-flex items-center gap-[8px] px-[16px] rounded-sm",
          "bg-transparent border border-[#e7ebf0] text-[#1a1a1a] text-[15px] font-normal",
          "hover:bg-white transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {icon && (
          <span className="w-[16px] h-[16px] flex items-center justify-center shrink-0 [&_svg]:w-[16px] [&_svg]:h-[16px]">
            {icon}
          </span>
        )}
        {content && <span className="leading-none">{content}</span>}
      </button>
    );
  }
);

OutlineButton.displayName = "OutlineButton";
