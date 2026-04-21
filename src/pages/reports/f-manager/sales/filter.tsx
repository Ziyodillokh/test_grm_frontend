import { Calendar } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";

export default function SalesFilter({
  totalCount,
  totalKv,
  totalSum,
  totalProfit,
  totalDiscount,
  totalComingSum,
  totalOverheadSum,
}: {
  totalCount: number;
  totalKv: number;
  totalSum: number;
  totalProfit: number;
  totalDiscount: number;
  totalComingSum?: number;
  totalOverheadSum?: number;
}) {
  return (
    <div className="h-[64px] items-center flex gap-2 mb-2">
      <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto bg-card rounded-sm">
        <p className="text-[14px] text-foreground">{totalCount} шт</p>
        <p className="text-[14px] text-foreground">{totalKv?.toFixed(2)} м²</p>
        <p className="text-[14px] text-foreground">{totalSum?.toFixed(2)} $</p>
        {totalComingSum != null && (
          <p className="text-[14px] text-foreground">{totalComingSum?.toFixed(2)} $ zavor</p>
        )}
        {totalOverheadSum != null && (
          <p className="text-[14px] text-foreground">{totalOverheadSum?.toFixed(2)} $ ustama</p>
        )}
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
