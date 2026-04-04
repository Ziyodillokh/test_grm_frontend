import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";

import CardSort from "@/components/card-sort";
import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { ReportColumns } from "@/pages/cashier/report/page/columns";
import { useKassaReportSingle } from "@/pages/reports/m-manager/filial-report-finance/queries";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "Терминал",
  discount: "Скидка",
  navar: "Навар",
};
const typeFilter: Record<string, string> = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};

export default function MonthlyKassaDetailPage() {
  const { id } = useParams();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [tip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState("sortSingle", parseAsString.withDefault("Все"));

  const { data: kassaReport } = useKassaReportSingle({
    id: id || undefined,
    enabled: Boolean(id),
  });

  const cashflowStatus =
    sort === "all" ? undefined : sort === "pending" ? "pending" : "accepted";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: id || "",
        limit: 10,
        page: 1,
        tip: tipFilter[tip as string],
        type:
          sortSingle === "Все"
            ? typeFilter[tip as string]
            : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip === "collection" ? "Инкассация" : undefined,
        status: cashflowStatus,
      },
      enabled: Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {kassaReport?.filial?.name || "Kassa"} — {kassaReport?.month ? `${kassaReport.month}-oy` : ""}
        </h2>
      </div>
      <CardSort
        KassaReport={kassaReport as any}
        KassaId={id || ""}
        isKassa={false}
      />
      <div className="h-[calc(100vh-330px)] scrollCastom">
        <DataTable
          columns={ReportColumns}
          data={flatData || []}
          isLoading={isLoading}
          hasHeader={false}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
