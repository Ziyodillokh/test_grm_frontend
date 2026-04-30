import FilterSelect from "@/components/filters-ui/filter-select";
import { parseAsString, useQueryState } from "nuqs";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";
import ReportToolbar from "@/components/report-toolbar";

const CashflowStatus = [
  { label: "Barchasi", value: "all" },
  { label: "Kutilmoqda", value: "pending" },
  { label: "Tasdiqlangan", value: "accepted" },
  { label: "Rad etilgan", value: "rejected" },
];

const SortSingle = [
  { label: "Hammasi", value: "Все" },
  { label: "Chiqim", value: "Расход" },
  { label: "Kirim", value: "Приход" },
];

export default function Filters({
  kassaId,
}: {
  kassaId: string | undefined;
}) {
  const [id] = useQueryState("id");
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [sortSingle, setSortSingle] = useQueryState("sortSingle", parseAsString);

  const hasActiveFilter = sort !== "all" || (!!sortSingle && sortSingle !== "Все");
  const clearFilters = () => {
    setSort(null);
    setSortSingle(null);
  };

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        kassaId: kassaId || id || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";

      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });

  return (
    <ReportToolbar
      onExport={() => exelMudate()}
      excelPending={exelPending}
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterContent={
        <>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Holat</p>
            <FilterSelect
              variant="filter"
              options={CashflowStatus}
              placeholder="Barchasi"
              defaultValue="all"
              name="sort"
            />
          </div>
          {(sort === "all" || Boolean(id)) && (
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
              <FilterSelect
                variant="filter"
                options={SortSingle}
                placeholder="Hammasi"
                defaultValue="Все"
                name="sortSingle"
              />
            </div>
          )}
        </>
      }
    />
  );
}
