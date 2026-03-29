import {  FileOutput } from "lucide-react";

import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";

export default function Filters({
  totalCount,
  totalKv,
  totalPrice
}:{
  totalCount: number,
  totalKv: number,
  totalPrice: number
}) {

  return (
    <div className=" h-[64px] items-center  flex  gap-2 mb-2  ">
      
       <div className=" text-nowrap p-5 flex gap-4 items-center  h-full bg-card rounded-xl">
            <p className="text-[14px] text-foreground">{totalCount} шт</p>
            <p className="text-[14px] text-foreground">{totalKv}  м²</p>
            <p className="text-[14px] text-foreground">{totalPrice} $</p>
          </div>

      <FilterSelect 
        options={MonthsArray}
        defaultValue={getMonth(new Date()) + 1 + ""  }
        name="month"
        className="w-[160px] px-2 h-[62px]  "
      />
      <Button
        className="h-full  w-[140px]  "
        variant={"secondary"}
      >
        <FileOutput /> Экспорт
      </Button>
    </div>
  );
}
