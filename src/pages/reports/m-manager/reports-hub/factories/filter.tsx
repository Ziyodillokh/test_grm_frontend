import { parseAsString, useQueryState } from "nuqs";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import ReportToolbar from "@/components/report-toolbar";
import { FactoryReportTotals } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function FactoryFilter({
  totals,
}: {
  totals?: FactoryReportTotals;
}) {
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [month, setMonth] = useQueryState("month", parseAsString.withDefault(currentMonth));

  const hasActiveFilter = yearFilter !== currentYear || month !== currentMonth;
  const clearFilters = () => {
    setYearFilter(null);
    setMonth(null);
  };

  return (
    <ReportToolbar
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
            <FilterSelect
              variant="filter"
              placeholder="Yil tanlang"
              options={yearsArray}
              name="year"
              defaultValue={yearFilter}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
            <FilterSelect
              variant="filter"
              placeholder="Oy tanlang"
              options={MonthsArray}
              name="month"
              defaultValue={currentMonth}
            />
          </div>
        </>
      }
    />
  );
}
