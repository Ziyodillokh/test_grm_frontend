import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { CashflowList } from "@/components/cashflow-list";
import { useLogisticsDetail } from "./queries";
import ReportToolbar from "@/components/report-toolbar";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function LogisticsDetailPage() {
  const { logisticsId } = useParams();
  const currentYear = String(new Date().getFullYear());
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);

  const activeYear = Number(yearFilter);

  const hasActiveFilter = yearFilter !== currentYear || !!startDate || !!endDate;
  const clearFilters = () => {
    setYearFilter(null);
    setStartDate(null);
    setEndDate(null);
  };

  const { data, isLoading } = useLogisticsDetail({
    logisticsId: logisticsId || "",
    queries: {
      year: activeYear,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const logistics = data?.pages?.[0]?.logistics;

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: (logistics?.title || "") + ":", value: logistics?.owed || 0, color: "#FF6600" },
          { value: logistics?.given || 0, color: "#47B13C" },
          { value: logistics?.totalDebt || 0, color: "#1a1a1a" },
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
                defaultValue={String(activeYear)}
              />
            </div>
            <div className="flex flex-col gap-[6px] col-span-2">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
              <DateRangePicker variant="filter" fromPlaceholder="Boshlanish" toPlaceholder="Tugash" />
            </div>
          </>
        }
      />

      <div className="flex-1 min-h-0 overflow-auto scrollCastom">
        <CashflowList items={items as any} isLoading={isLoading} gap={10} />
      </div>
    </div>
  );
}
