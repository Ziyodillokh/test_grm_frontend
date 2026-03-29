import { FileOutput } from "lucide-react";

import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { Button } from "@/components/ui/button";

export default function Filters() {
  return (
    <div className="bg-sidebar  gap-2 px-[20px] h-[64px]   flex   ">
      <p className="text-[20px] my-auto mr-auto font-medium">Crop</p>
      <DateRangePicker fromPlaceholder="Start date" toPlaceholder="End date" />
      <Button
        className="h-full border-x-1 border-y-0 w-[140px] "
        variant={"outline"}
      >
        <FileOutput /> Экспорт
      </Button>
    </div>
  );
}
