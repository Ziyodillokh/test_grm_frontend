import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import useDataFetch from "@/pages/filial/table/queries";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { MonthsArray } from "@/consts";
import { getAllData } from "@/service/apiHelpers";
import { CashflowType } from "@/components/adding-parish-flow";
import qs from "qs";
import ReportToolbar from "@/components/report-toolbar";

export default function Filters({
  month,
  filial,
}: {
  month: number | undefined;
  filial: string | undefined;
}) {
  const { id, kassaId } = useParams();
  const { data } = useDataFetch({
    queries: { type: "filial", limit: 50 },
  });

  const [tip] = useQueryState("tip", parseAsString);
  const [typesManage] = useQueryState("typesManage", parseAsString);

  const [myCashFlow] = useQueryState(
    "myCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const { data: cashflowTypesResponse } = useQuery({
    queryKey: [!myCashFlow ? "/cashflow-types/for/branch-manager" : "/cashflow-types/by/managers", tip, typesManage],
    queryFn: () =>
      getAllData<CashflowType[], object>(!myCashFlow ? "/cashflow-types/for/branch-manager" : "/cashflow-types/by/managers/" + (typesManage ? typesManage : "both"), {
        type: tip == "expense" ? "out" : tip == "income" ? tip : undefined,
      }),
    select: (res) =>
      res.map((item) => ({
        value: item?.slug,
        label: item?.title,
      })),
  });

  const { data: managersAccountants } = useQuery({
    queryKey: ["/user/managers-accountants", tip],
    queryFn: () =>
      getAllData<{
        items: {
          id: string;
          firstName: string;
        }[]
      }, object>("/user/managers-accountants"),
    select: (res) =>
      res?.items?.map((item) => ({
        value: item?.id,
        label: item?.firstName,
      })),
  });

  const [FManagerCashFlow] = useQueryState(
    "FManagerCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const filialOption =
    data?.pages[0]?.items?.map((e) => ({
      label: e?.name,
      value: e?.id,
    })) || [];

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        reportId: myCashFlow && !FManagerCashFlow ? id : undefined,
        kassaId: FManagerCashFlow
          ? (kassaId || undefined)
          : (myCashFlow ? undefined : id || undefined),
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";

      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });

  if (!id && !kassaId) {
    return (
      <ReportToolbar
        onExport={() => exelMudate()}
        excelPending={exelPending}
        filterContent={
          <>
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Filial</p>
              <FilterSelect
                placeholder="Hammasi"
                className="w-full"
                options={[{ value: "clear", label: "Hammasi" }, ...filialOption]}
                name="filial"
              />
            </div>
          </>
        }
      />
    );
  }

  return (
    <ReportToolbar
      onExport={() => exelMudate()}
      excelPending={exelPending}
      beforeIcons={
        <div className="flex items-center bg-white rounded-sm px-[12px] h-[42px]">
          <span className="text-[14px] font-medium text-[#1a1a1a]">
            {month && MonthsArray[(month || 1) - 1].label} | {filial}
          </span>
        </div>
      }
      filterContent={
        <>
          {myCashFlow && managersAccountants && (
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Menejer</p>
              <FilterSelect
                placeholder="Hammasi"
                className="w-full"
                options={[{ value: "clear", label: "Hammasi" }, ...managersAccountants]}
                name="typesManage"
              />
            </div>
          )}
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
            <FilterSelect
              placeholder="Hammasi"
              className="w-full"
              options={
                cashflowTypesResponse
                  ? [{ value: "clear", label: "Hammasi" }, ...cashflowTypesResponse]
                  : []
              }
              name="cashflowSlug"
            />
          </div>
          <Button variant="outline" className="w-full mt-2">
            Tozalash
          </Button>
        </>
      }
    />
  );
}
