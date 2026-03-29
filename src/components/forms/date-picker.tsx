import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

interface iDatePickerDemo {
  onChange: () => void;
  value: Date;
  placeholder?: string;
}

export function DatePickerDemo({
  onChange,
  value,
  placeholder,
}: iDatePickerDemo) {

  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left bg-input h-10.5 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 w-full h-4 " />
          {value ? (
            format(value, "PPP")
          ) : (
            <span>{placeholder ? t(placeholder) : "date picker"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
