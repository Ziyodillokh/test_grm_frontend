import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const FILTER_INPUT_TRIGGER =
  "relative w-full h-[44px] bg-white hover:bg-white border-0 border-b border-[#e7ebf0] rounded-[4px] font-normal text-[14px] text-[#1a1a1a] flex items-center pl-3 pr-9";
export const FILTER_INPUT_PLACEHOLDER = "text-[#0078d4]";

export function FilterDateInput({
  value,
  onChange,
  placeholder = "Sanani tanlang",
  defaultMonth,
}: {
  /** ISO date string (yyyy-MM-dd) yoki to'liq ISO timestamp */
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  placeholder?: string;
  defaultMonth?: Date;
}) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="relative w-full">
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className={`${FILTER_INPUT_TRIGGER} text-left`}>
            {date ? (
              <span>{format(date, "dd, LLL, y")}</span>
            ) : (
              <span className={FILTER_INPUT_PLACEHOLDER}>{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            className="rounded-sm"
            selected={date}
            onSelect={(d) => onChange(d ? d.toISOString().slice(0, 10) : null)}
            defaultMonth={defaultMonth}
          />
        </PopoverContent>
      </Popover>
      {date ? (
        <X
          onClick={() => onChange(null)}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-[#1a1a1a]"
        />
      ) : (
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-[#1a1a1a] pointer-events-none" />
      )}
    </div>
  );
}

export interface FilterPopoverOption {
  label: string;
  value: string | null;
}

export function FilterPopoverSelect({
  value,
  onChange,
  options,
  placeholder = "Tanlang",
  showClearOption,
  clearLabel = "Barchasi",
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  options: FilterPopoverOption[];
  placeholder?: string;
  showClearOption?: boolean;
  clearLabel?: string;
}) {
  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label || (showClearOption ? clearLabel : null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={FILTER_INPUT_TRIGGER}>
          {displayLabel ? (
            <span className="flex-1 text-left truncate">{displayLabel}</span>
          ) : (
            <span className={`flex-1 text-left ${FILTER_INPUT_PLACEHOLDER}`}>{placeholder}</span>
          )}
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a] shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-[4px] max-h-[320px] overflow-y-auto scrollCastom"
      >
        {showClearOption && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
              !value ? "bg-[#f5f7f9] font-medium" : ""
            }`}
          >
            {clearLabel}
          </button>
        )}
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
              value === o.value ? "bg-[#f5f7f9] font-medium" : ""
            }`}
          >
            {o.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
