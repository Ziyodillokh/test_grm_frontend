import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  fromPlaceholder?: string;
  toPlaceholder?: string;
  className?: string;
  defaultMonth?: Date;
  /** "default" — old style (62px, left icon). "filter" — 44px, right icon, blue placeholder, white bg, border-bottom only */
  variant?: "default" | "filter";
}

export function DateRangePicker({
  fromPlaceholder,
  toPlaceholder,
  className,
  defaultMonth,
  variant = "default",
}: DateRangePickerProps) {
  const isFilter = variant === "filter";
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useQueryState<Date>("startDate", {
    parse: (value) =>
      value
        ? new Date(value)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });
  const [toDate, setToDate] = useQueryState<Date>("endDate", {
    parse: (value) =>
      value
        ? new Date(value)
        : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });
  // Filter variant: 44px height, right icon, blue placeholder, white bg, border-bottom only
  const triggerClass = isFilter
    ? "w-full justify-start text-left bg-white hover:bg-white rounded-none h-[44px] border-0 border-b border-[#e7ebf0] font-normal pl-3 pr-9"
    : "w-full justify-start text-left bg-card pl-8 hover:bg-card rounded-sm h-[62px] border-0 font-normal";

  const placeholderClass = isFilter ? "text-[#0078d4]" : "";
  const iconClass = isFilter
    ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-[#1a1a1a] hover:text-foreground"
    : "absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground";

  return (
    <div
      className={`flex items-center max-w-full w-full ${isFilter ? "flex-row gap-[20px]" : "flex-col sm:flex-row gap-2"} ${className && className}`}
    >
      <div className="flex-1 relative w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(triggerClass, !fromDate && "text-muted-foreground")}
            >
              {fromDate ? (
                format(fromDate, "dd, LLL, y")
              ) : (
                <span className={placeholderClass}>
                  {fromPlaceholder ? t(fromPlaceholder) : t("From date")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              className="rounded-sm"
              selected={fromDate || undefined}
              onSelect={(date) => (date ? setFromDate(date) : "")}
              defaultMonth={defaultMonth}
              disabled={(date) => (toDate ? date > toDate : false)}
            />
          </PopoverContent>
        </Popover>
        {fromDate ? (
          <X onClick={() => setFromDate(null)} className={iconClass} />
        ) : (
          <CalendarIcon className={iconClass} />
        )}
      </div>

      <div className="flex-1 relative w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(triggerClass, !toDate && "text-muted-foreground")}
            >
              {toDate ? (
                format(toDate, "dd, LLL, y")
              ) : (
                <span className={placeholderClass}>
                  {toPlaceholder ? t(toPlaceholder) : t("To date")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              className="rounded-sm"
              defaultMonth={defaultMonth}
              selected={toDate || undefined}
              onSelect={(date) => (date ? setToDate(date) : "")}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>

        {toDate ? (
          <X onClick={() => setToDate(null)} className={iconClass} />
        ) : (
          <CalendarIcon className={iconClass} />
        )}
      </div>
    </div>
  );
}
