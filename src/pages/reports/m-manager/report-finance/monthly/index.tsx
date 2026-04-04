import { DataTable } from "@/components/ui/data-table";
import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";
import { useReports, useReportsTotal } from "./queries";
import { MonthlyColumns } from "./columns";
import ReportTotals from "./report-totals";

export default function MonthlyReportsPage() {
  const { year } = useYear();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReports({
    queries: { year, limit: 12 },
  });

  const { data: totals } = useReportsTotal({
    queries: { year },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span className="cursor-pointer hover:text-foreground" onClick={() => navigate("/m-manager/reports-hub")}>
          Hisobotlar
        </span>
        <span>•</span>
        <span className="text-foreground font-medium">Oylik Hisobotlar</span>
      </div>

      <ReportTotals
        data={totals}
        onGreenCardClick={() => {}}
      />

      <div className="h-[calc(100vh-400px)] scrollCastom">
        <DataTable
          columns={MonthlyColumns}
          data={flatData}
          isLoading={isLoading}
          isRowClickble={true}
          onRowClick={(row) => {
            if (row?.id) {
              navigate(`/m-manager/reports-hub/monthly/${row.id}/info`);
            }
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
