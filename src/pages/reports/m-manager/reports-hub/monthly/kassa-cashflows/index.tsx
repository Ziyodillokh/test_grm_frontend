import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { useKassaReportSingle } from "@/pages/reports/m-manager/filial-report-finance/queries";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import KassaToolbar from "@/pages/cashier/report/page/kassa-toolbar";
import { CashflowColumns } from "./columns";

export default function KassaCashflowsPage() {
  const { kassaId, id } = useParams();
  const activeId = kassaId || id;
  const [search] = useQueryState("search", parseAsString);
  const [sellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate] = useQueryState("startDate", parseAsString);
  const [endDate] = useQueryState("endDate", parseAsString);

  const { data: kassaReport } = useKassaReportSingle({
    id: activeId || undefined,
    enabled: Boolean(activeId),
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: activeId || "",
        limit: 10,
        page: 1,
        search: search || undefined,
        sellerId: sellerId || undefined,
        cashflowTypeId: cashflowTypeId || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
      },
      enabled: Boolean(activeId),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="p-4">
      <ReportTotals data={kassaReport as any} />

      {/* Toolbar */}
      <KassaToolbar kassaId={activeId || ""} />

      <div className="h-[calc(100vh-380px)] scrollCastom">
        <DataTable
          columns={CashflowColumns.filter(col => col.id !== 'harakatlar')}
          data={flatData}
          isLoading={isLoading}
          hasHeader={true}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
