import { RefreshCw } from "lucide-react";

interface RefreshRequestButtonProps {
  onClick?: () => void;
  /** Birinchi qator (15px medium) */
  title?: string;
  /** Ikkinchi qator (13px regular) */
  subtitle?: string;
  /** Custom icon — default RefreshCw 36×36 */
  icon?: React.ReactNode;
  /** Textlardan 4px o'ngda ko'rinadigan badge soni. 0 yoki null bo'lsa ko'rinmaydi. */
  badge?: number | null;
  /** Badge fon rangi (default #FF6527) */
  badgeBg?: string;
  className?: string;
}

/**
 * Icon (36×36) + 2 qator text (15px medium / 13px regular) shaklidagi reusable tugma.
 * Avval Boss Dashboardning "Yangilashni so'rash" tugmasi sifatida yaratilgan, keyin generic.
 */
export default function RefreshRequestButton({
  onClick,
  title = "Yangilashni so'rash",
  subtitle = "Barcha kirim-chiqimlarni kiritishni so'rash",
  icon,
  badge,
  badgeBg = "#FF6527",
  className,
}: RefreshRequestButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[8px] hover:opacity-80 transition ${className || ""}`}
    >
      <span className="w-[36px] h-[36px] flex items-center justify-center shrink-0 text-[#1a1a1a] [&_svg]:w-[36px] [&_svg]:h-[36px]">
        {icon || <RefreshCw className="w-[36px] h-[36px] text-[#1a1a1a]" strokeWidth={1.5} />}
      </span>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[15px] text-[#1a1a1a] font-medium">{title}</span>
        <span className="text-[13px] text-[#1a1a1a] font-normal opacity-60">{subtitle}</span>
      </div>
      {!!badge && badge > 0 && (
        <span
          className="ml-[4px] min-w-[20px] h-[20px] px-[6px] rounded-full text-white text-[11px] font-semibold flex items-center justify-center shrink-0"
          style={{ background: badgeBg }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
