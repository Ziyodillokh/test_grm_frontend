import { getMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import { useMeStore } from "@/store/me-store";
import useDataFetch from "@/pages/filial/table/queries";
import ReportToolbar from "@/components/report-toolbar";

export default function Filter() {
  const { meUser } = useMeStore();
  const currentMonth = String(getMonth(new Date()) + 1);

  const [filial, setFilial] = useQueryState("filial", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsString.withDefault(currentMonth));

  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });
  const filialOptions =
    data?.pages?.[0]?.items?.map((e: any) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  const hasActiveFilter =
    (!!filial && filial !== "clear") || month !== currentMonth;
  const clearFilters = () => {
    setFilial(null);
    setMonth(null);
  };

  const showFilial = meUser?.position?.role != 4;

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          {showFilial && (
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
              <FilterSelect
                variant="filter"
                placeholder="Barcha filiallar"
                defaultValue="clear"
                options={[{ value: "clear", label: "Barcha filiallar" }, ...filialOptions]}
                name="filial"
              />
            </div>
          )}
          <div className={`flex flex-col gap-[6px] ${showFilial ? "" : "col-span-2"}`}>
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
