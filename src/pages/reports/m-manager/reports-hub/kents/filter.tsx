import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { KentReportTotals } from "./type";

export default function KentFilter({
  totals,
  onExport,
  excelPending,
}: {
  totals?: KentReportTotals;
  onExport?: () => void;
  excelPending?: boolean;
}) {
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsString);

  const hasActiveFilter = !!search || !!month;
  const clearFilters = () => {
    setSearch(null);
    setMonth(null);
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      onExport={onExport}
      excelPending={excelPending}
      filterCols={1}
      filterContent={
        <div className="flex flex-col gap-[6px]">
          <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
          <FilterSelect
            variant="filter"
            placeholder="Oy tanlang"
            classNameContainer="z-[60]"
            options={MonthsArray}
            name="month"
            defaultValue={String(new Date().getMonth() + 1)}
          />
        </div>
      }
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
    />
  );
}
