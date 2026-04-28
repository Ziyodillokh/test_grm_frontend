import { X } from "lucide-react";

interface RightSheetProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  /** Panel eni — default 500px */
  width?: number;
}

/**
 * O'ng tomondan ochiladigan to'liq balandlikdagi panel.
 * Backdrop (50% qora) + 500px width oq panel + header (title + X) + scroll body.
 *
 * Misol:
 *   <RightSheet open={open} onClose={close} title="Mahsulot qo'shish">
 *     <FormContent />
 *   </RightSheet>
 */
export function RightSheet({ open, onClose, title, children, width = 500 }: RightSheetProps) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col shadow-2xl"
        style={{ width, maxWidth: "100vw" }}
      >
        <div className="flex items-center justify-between px-[20px] h-[56px] border-b border-border shrink-0">
          <h2 className="text-[16px] font-medium text-[#1a1a1a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-sm flex items-center justify-center hover:bg-[#f5f7f9] transition"
            aria-label="Yopish"
          >
            <X className="w-[18px] h-[18px] text-[#1a1a1a]" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto scrollCastom">{children}</div>
      </div>
    </>
  );
}
