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
}

export function DateRangePicker({
  fromPlaceholder,
  toPlaceholder,
  className,
  defaultMonth,
}: DateRangePickerProps) {
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
  return (
    <div
      className={`flex flex-col items-center  max-w-[290px] w-full sm:flex-row gap-2 ${className && className}`}
    >
      <div className="flex-1 relative ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start  text-left bg-card pl-8 hover:bg-card rounded-xl h-[62px] border-0 font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              {fromDate ? (
                format(fromDate, "dd, LLL, y")
              ) : (
                <span>
                  {fromPlaceholder ? t(fromPlaceholder) : t("From date")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              className="rounded-xl"
              //  captionLayout="dropdown"
              selected={fromDate || undefined}
              onSelect={(date) => (date ? setFromDate(date) : "")}
              defaultMonth={defaultMonth}
              disabled={(date) => (toDate ? date > toDate : false)}
            />
          </PopoverContent>
        </Popover>
        {fromDate ? (
          <X
            onClick={() => setFromDate(null)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
          />
        ) : (
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" />
        )}
      </div>

      <div className="flex-1  relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left border-0  pl-8 rounded-xl hover:bg-white bg-white h-[62px] font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              {toDate ? (
                format(toDate, "dd, LLL, y")
              ) : (
                <span>{toPlaceholder ? t(toPlaceholder) : t("To date")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              //  captionLayout="dropdown"
              className="rounded-xl"
              defaultMonth={defaultMonth}
              selected={toDate || undefined}
              onSelect={(date) => (date ? setToDate(date) : "")}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>

        {toDate ? (
          <X
            onClick={() =>  setToDate(null)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
          />
        ) : (
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" />
        )}
      </div>
    </div>
  );
}
