import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { Button } from "@/components/ui/button";
import { FileOutput } from "lucide-react";
import { useQueryState } from "nuqs";
import { TTopData } from "./type";


export default function Filters({ data }: { data: TTopData | undefined }) {
  const [userName] = useQueryState("userName");

  return (
    <div className="px-[20px] h-[64px] items-center  flex  gap-2 mb-2 ">
      <p className="text-[#272727] text-[20px] mr-auto">Отчёт по сотрудикам  | {userName}</p>
      <div className="flex items-center gap-[30px] h-[64px]  rounded-xl bg-card px-8">
        <p className="text-primary text-[14px] ">{data?.count} шт</p>
        <p className="text-primary text-[14px] ">{data?.kv} м²</p>
        <p className="text-primary text-[14px] ">{data?.totalPrice} $</p>
      </div>
      <DateRangePicker
        className="mr-10 "

      />
      <Button className="h-full  border-y-0 w-[140px]" variant={"secondary"}>
        <FileOutput /> Экспорт
      </Button>
    </div>
  );
}
