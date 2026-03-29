import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { getMonth } from "date-fns";
import { useParams } from "react-router-dom";

export default function Filters({
  totalCount,
  totalKv,
  totalPrice,
}: {
  totalCount: number;
  totalKv: number;
  totalPrice: number;
}) {
  const { countryId } = useParams();

  return (
    <div className=" h-[64px] items-center  flex  gap-2 mb-2  ">
      <div className=" text-nowrap p-5 flex gap-4 items-center  h-full mr-auto bg-card rounded-xl">
        <p className="text-[14px] text-foreground">{totalCount} шт</p>
        <p className="text-[14px] text-foreground">{totalKv} м²</p>
        <p className="text-[14px] text-foreground">{totalPrice} $</p>
      </div>
      <FilterSelect
        placeholder="все"
        className="w-[200px] pl-2  h-[65px] "
        defaultValue="none"
        disabled={Boolean(countryId)}
        options={[
          {
            label: "Отчет об остатке",
            value: "none",
          },
          {
            label: "Отчет о продажах",
            value: "other",
          },
        ]}
        name="typeOther"
      />

      <FilterSelect
        options={MonthsArray}
        defaultValue={getMonth(new Date()) + 1 + ""}
        name="month"
        className="w-[160px]  px-2 h-[62px]  "
      />
      {/* <Button className="h-full  w-[140px]  " variant={"secondary"}>
        <FileOutput /> Экспорт
      </Button> */}
    </div>
  );
}
