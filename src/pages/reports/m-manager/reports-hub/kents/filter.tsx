import { Calendar, FileOutput } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { MonthsArray } from "@/consts";
import { Button } from "@/components/ui/button";
import { KentReportTotals } from "./type";
import formatPrice from "@/utils/formatPrice";

export default function KentFilter({
  totals,
  showExport,
  onExport,
}: {
  totals?: KentReportTotals;
  showExport?: boolean;
  onExport?: () => void;
}) {
  return (
    <div className="bg-sidebar border-border border-b h-[64px] flex">
      <SearchInput className="border-border border-r" />

      <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto">
        {totals && (
          <>
            <p className="text-[13px] text-[#FF6600]">
              Olingan: {formatPrice(totals.total_owed || 0)} $
            </p>
            <p className="text-[13px] text-[#89A143]">
              Qaytarilgan: {formatPrice(totals.total_given || 0)} $
            </p>
            <p className="text-[13px] font-bold">
              Qolgan: {formatPrice(totals.total_debt || 0)} $
            </p>
          </>
        )}
      </div>

      <FilterSelect
        placeholder="Oy tanlang"
        className="border-border max-w-[160px] w-full border-l"
        options={MonthsArray}
        name="month"
        icons={<Calendar size={18} />}
        defaultValue={String(new Date().getMonth() + 1)}
      />

      {showExport && (
        <Button
          onClick={onExport}
          variant="secondary"
          className="h-full border-l border-border rounded-none px-4"
        >
          <FileOutput size={18} />
          Export
        </Button>
      )}
    </div>
  );
}
