import { useParams } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { useKassaReportSingle } from "@/pages/reports/m-manager/filial-report-finance/queries";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { CashflowColumns } from "./columns";

export default function KassaCashflowsPage() {
  const { kassaId, id } = useParams();
  const activeId = kassaId || id;

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
      },
      enabled: Boolean(activeId),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="p-4">
      <ReportTotals data={kassaReport as any} />

      <div className="h-[calc(100vh-340px)] scrollCastom">
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
