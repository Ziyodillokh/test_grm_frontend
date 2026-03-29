import { Clock } from "lucide-react";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

interface iTimePicker {
  onChange: (time: string) => void;
  value: string;
  placeholder?: string;
}
const TimePicker = ({ onChange, value = "", placeholder }: iTimePicker) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove non-numeric characters and limit to 5 characters
    value = value.replace(/[^0-9:]/g, "").slice(0, 5);

    // Automatically add : after 2 characters
    if (value.length === 2 && !value.includes(":")) {
      value += ":";
    }

    // Validate hours
    const parts = value.split(":");
    const validHour = parts[0]
      ? Math.min(Math.max(parseInt(parts[0]) || 0, 0), 23)
          .toString()
          .padStart(2, "0")
      : "";

    // Validate minutes
    const validMinute = parts[1]
      ? Math.min(Math.max(parseInt(parts[1]) || 0, 0), 59)
          .toString()
          .padStart(2, "0")
      : "";

    // Combine validated time
    const formattedTime =
      validHour && validMinute ? `${validHour}:${validMinute}` : value;

    onChange(formattedTime);
  };

  return (
    <div className="flex flex-col space-y-2 max-w-[250px]">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="time"
              type="text"
              value={value}
              onChange={handleManualTimeChange}
              placeholder={placeholder ? placeholder : ` HH:MM`}
              className="pl-8"
            />
            <Clock
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
              onClick={() => setIsPopoverOpen(true)}
            />
          </div>
        </PopoverTrigger>
      </Popover>
    </div>
  );
};

export default TimePicker;
