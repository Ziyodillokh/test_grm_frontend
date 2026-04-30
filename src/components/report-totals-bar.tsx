import formatPrice from "@/utils/formatPrice";

export interface TotalItem {
  label?: string;
  value: number;
  /** Maxsus rang (Foyda → yashil, Qarz → orange h.k.). Default #1a1a1a. */
  color?: string;
  /** Birlik: "ta", "m²", "$" — default "$" */
  suffix?: string;
}

interface ReportTotalsBarProps {
  items: TotalItem[];
}

/**
 * Toolbar totals — bgsiz. "Umumiy [sum-icon] :" prefiks 15px regular #1a1a1a 50%,
 * qiymatlar 15px regular (color prop mavjud bo'lsa o'sha rangda, default #1a1a1a),
 * "N suffix" formatida, oraliq 16px.
 */
export default function ReportTotalsBar({ items }: ReportTotalsBarProps) {
  return (
    <div className="flex items-center gap-[16px] h-[42px] px-[16px] rounded-[6px] border border-[#e7ebf0]">
      <span className="flex items-center gap-[4px] text-[15px] font-normal text-[#1a1a1a]/50">
        <span>Umumiy</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M13.5 12V13.5C13.5 13.6989 13.421 13.8897 13.2803 14.0303C13.1397 14.171 12.9489 14.25 12.75 14.25H4.5L9 9L4.5 3.75H12.75C12.9489 3.75 13.1397 3.82902 13.2803 3.96967C13.421 4.11032 13.5 4.30109 13.5 4.5V6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>:</span>
      </span>
      {items.map((item, i) => (
        <span
          key={i}
          className="text-[15px] font-normal"
          style={{ color: item.color || "#1a1a1a" }}
        >
          {formatPrice(item.value || 0)} {item.suffix ?? "$"}
        </span>
      ))}
    </div>
  );
}
