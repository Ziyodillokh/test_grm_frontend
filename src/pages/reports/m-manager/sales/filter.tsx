import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { useMeStore } from "@/store/me-store";
import { MonthsArray } from "@/consts";

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
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;

  const [search, setSearch] = useQueryState("search", parseAsString);
  const [view, setView] = useQueryState("view", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsString);

  const hasActiveFilter = !!search || !!view || !!month;
  const clearFilters = () => {
    setSearch(null);
    setView(null);
    setMonth(null);
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          {isManager && (
            <div className="col-span-2 flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Ko'rinish</p>
              <FilterSelect
                variant="filter"
                placeholder="Turini tanlang"
                classNameContainer="z-[60]"
                defaultValue="filial"
                options={[
                  { label: "Filial bo'yicha", value: "filial" },
                  { label: "Diller bo'yicha", value: "dealer" },
                  { label: "Internet bo'yicha", value: "internet" },
                  { label: "Partiya bo'yicha", value: "partiya" },
                ]}
                name="view"
              />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-[6px]">
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
        { value: totalCount, suffix: "ta" },
        { value: totalKv, suffix: "m²" },
        { value: totalSum, suffix: "$" },
        { value: totalProfit, suffix: "$", color: "#47B13C" },
        { value: totalDiscount, suffix: "$", color: "#FF6527" },
      ]}
    />
  );
}
