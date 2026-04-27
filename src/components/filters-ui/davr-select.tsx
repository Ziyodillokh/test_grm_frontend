import { Calendar, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

const yearsList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

interface DavrSelectProps {
  month: number;
  year: number;
  onChangeMonth: (m: number) => void;
  onChangeYear: (y: number) => void;
  /** Trigger eni — default 200px (FilialSelect bilan bir xil) */
  width?: number;
  className?: string;
}

/**
 * Davr (oy + yil) selektor — FilialSelect bilan bir xil trigger uslubida.
 * 200×42, border #e7ebf0, ko'k matn, oq bg (qiymat doim mavjud bo'lgani uchun).
 */
export function DavrSelect({
  month,
  year,
  onChangeMonth,
  onChangeYear,
  width = 200,
  className,
}: DavrSelectProps) {
  const monthLabel = MONTHS[(month || 1) - 1];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{ width }}
          className={`flex items-center gap-[6px] h-[42px] px-[12px] border border-[#e7ebf0] rounded-[6px] bg-white transition-colors ${className || ""}`}
        >
          <span className="w-[16px] h-[16px] flex items-center justify-center shrink-0 text-[#1a1a1a]">
            <Calendar className="w-[16px] h-[16px]" strokeWidth={1.4} />
          </span>
          <span className="text-[13px] font-medium text-[#1a1a1a]">Davr</span>
          <span className="text-[13px] font-medium ml-[2px] flex-1 text-left truncate text-[#0078d4]">
            {monthLabel} {year}
          </span>
          <ChevronDown className="w-[14px] h-[14px] text-[#1a1a1a] shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-[8px]" align="start">
        <div className="flex gap-[4px] mb-[6px] flex-wrap">
          {yearsList.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => onChangeYear(y)}
              className={`px-[10px] h-[28px] text-[12px] rounded-[4px] ${
                year === y
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-[4px]">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => onChangeMonth(i + 1)}
              className={`h-[30px] text-[12px] rounded-[4px] ${
                month === i + 1
                  ? "bg-[#0078d4] text-white"
                  : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
