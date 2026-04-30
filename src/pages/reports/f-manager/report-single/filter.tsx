import { useMutation, useQuery } from "@tanstack/react-query";
import qs from "qs";
import { apiRoutes } from "@/service/apiRoutes";
import { useParams } from "react-router-dom";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { getAllData } from "@/service/apiHelpers";
import { CashflowType } from "@/components/adding-parish-flow";
import FilterSelect from "@/components/filters-ui/filter-select";
import { MonthsArray } from "@/consts";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters() {
  const { id, report } = useParams();

  const [tip] = useQueryState("tip", parseAsString);
  const [myMonth] = useQueryState("myMonth", parseAsInteger);
  const [cashflowSlug, setCashflowSlug] = useQueryState("cashflowSlug", parseAsString);

  const hasActiveFilter = !!cashflowSlug && cashflowSlug !== "clear";
  const clearFilters = () => {
    setCashflowSlug(null);
  };

  const { data: cashflowTypesResponse } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager", tip],
    queryFn: () =>
      getAllData<CashflowType[], object>("/cashflow-types/for/branch-manager", {
        type: tip == "expense" ? "out" : tip == "income" ? tip : undefined,
      }),
    select: (res) =>
      res.map((item) => ({
        value: item?.slug,
        label: item?.title,
      })),
  });

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        kassaId: id == "my" ? (report || undefined) : (id || undefined),
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
      beforeIcons={
        <div className="flex items-center bg-white rounded-sm px-[12px] h-[42px]">
          <span className="text-[14px] font-medium text-[#1a1a1a]">
            Oylik hisobot | {myMonth && MonthsArray[(myMonth || 1) - 1].label}
          </span>
        </div>
      }
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      filterCols={1}
      filterContent={
        <div className="flex flex-col gap-[6px]">
          <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
          <FilterSelect
            variant="filter"
            placeholder="Hammasi"
            options={
              cashflowTypesResponse
                ? [{ value: "clear", label: "Hammasi" }, ...cashflowTypesResponse]
                : []
            }
            name="cashflowSlug"
          />
        </div>
      }
    />
  );
}
