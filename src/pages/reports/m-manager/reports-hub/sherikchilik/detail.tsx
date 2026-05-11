import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { CashflowList } from "@/components/cashflow-list";
import { useYear } from "@/store/year-store";

import { useShareDetail } from "./queries";

export default function SherikchilikDetailPage() {
  const { shareId } = useParams();
  const { year } = useYear();
  const [typeFilter] = useQueryState("type", parseAsString);
  const [kindFilter] = useQueryState("kind", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [, setTypeQs] = useQueryState("type", parseAsString);
  const [, setKindQs] = useQueryState("kind", parseAsString);

  const { data, isLoading } = useShareDetail({
    shareId: shareId || "",
    queries: {
      year,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
      type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      kind: kindFilter === "clear" ? undefined : kindFilter || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const share = data?.pages?.[0]?.share;

  const clearFilters = () => {
    setSearch(null);
    setStartDate(null);
    setEndDate(null);
    setTypeQs(null);
    setKindQs(null);
  };
  const hasActiveFilter = !!search || !!typeFilter || !!kindFilter || !!startDate || !!endDate;

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          filterContent={
            <>
              <div className="flex flex-col gap-[6px] col-span-2">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
                <DateRangePicker variant="filter" fromPlaceholder="Boshlanish" toPlaceholder="Tugash" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Olingan (Ulush)", value: "income" },
                    { label: "Berilgan", value: "expense" },
                  ]}
                  defaultValue="clear"
                  name="type"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Berilgan turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Tani", value: "capital" },
                    { label: "Foyda", value: "profit" },
                  ]}
                  defaultValue="clear"
                  name="kind"
                />
              </div>
            </>
          }
          totalsItems={[
            { label: share?.fullName, value: share?.capital || 0, color: "#47B13C" },
            { value: share?.profit || 0, color: "#FF6600" },
            { value: share?.given_capital || 0, color: "#EF5C12" },
            { value: share?.given_profit || 0, color: "#EF5C12" },
            { value: share?.totalDebt || 0, color: "#1a1a1a" },
          ]}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom">
        <CashflowList items={items as any} isLoading={isLoading} gap={10} />
      </div>
    </div>
  );
}
