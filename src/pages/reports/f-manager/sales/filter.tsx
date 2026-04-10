import { Calendar } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";

export default function SalesFilter({
  totalCount,
  totalKv,
  totalSum,
  totalProfit,
  totalDiscount,
}: {
  totalCount: number;
  totalKv: number;
  totalSum: number;
  totalProfit: number;
  totalDiscount: number;
}) {
  const { year } = useYear();

  return (
    <div className="h-[64px] items-center flex gap-2 mb-2">
      <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto bg-card rounded-xl">
        <p className="text-[14px] text-foreground">{totalCount} шт</p>
        <p className="text-[14px] text-foreground">{totalKv?.toFixed(2)} м²</p>
        <p className="text-[14px] text-foreground">{totalSum?.toFixed(2)} $</p>
        <p className="text-[14px] text-foreground font-semibold text-green-600">
          {totalProfit?.toFixed(2)} $ foyda
        </p>
        <p className="text-[14px] text-foreground text-orange-500">
          {totalDiscount?.toFixed(2)} $ chegirma
        </p>
      </div>

      <FilterSelect
        placeholder="Oy tanlang"
        className="w-[180px] pl-2 h-[62px]"
        options={MonthsArray}
        name="month"
        icons={<Calendar size={18} />}
        defaultValue={String(new Date().getMonth() + 1)}
      />
    </div>
  );
}
