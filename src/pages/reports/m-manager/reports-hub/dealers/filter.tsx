import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { DealerReportTotals } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function DealerFilter({
  totals,
}: {
  totals?: DealerReportTotals;
}) {
  const [yearFilter, setYear] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsString);

  const hasActiveFilter = !!search || !!month || yearFilter !== String(new Date().getFullYear());
  const clearFilters = () => {
    setSearch(null);
    setMonth(null);
    setYear(String(new Date().getFullYear()));
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
            <FilterSelect
              variant="filter"
              placeholder="Yil tanlang"
              classNameContainer="z-[60]"
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
              classNameContainer="z-[60]"
              options={MonthsArray}
              name="month"
              defaultValue={String(new Date().getMonth() + 1)}
            />
          </div>
        </>
      }
      totalsItems={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]}
    />
  );
}
