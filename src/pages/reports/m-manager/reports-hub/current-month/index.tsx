import { DataTable } from "@/components/ui/data-table";
import { useNavigate } from "react-router-dom";
import ReportTotals from "../../report-finance/monthly/report-totals";
import { useReportsTotal } from "../../report-finance/monthly/queries";
import { useYear } from "@/store/year-store";
import { DetailColumns } from "../monthly/report-detail/columns";
import { useReportsSingle } from "../monthly/report-detail/queries";
import { useEffect, useState } from "react";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export default function CurrentMonthPage() {
  const navigate = useNavigate();
  const { year } = useYear();
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  // Joriy oyni topish — eng yangi report
  useEffect(() => {
    const fetchCurrentReport = async () => {
      try {
        const res = await getAllData<any, any>(apiRoutes.reports, {
          page: 1,
          limit: 1,
          year,
        });
        if (res?.items?.[0]?.id) {
          setCurrentReportId(res.items[0].id);
        }
      } catch (e) {
        console.error("Failed to fetch current report", e);
      }
    };
    fetchCurrentReport();
  }, [year]);

  const { data: totals } = useReportsTotal({
    queries: { year },
  });

  const { data: reportData, isLoading } = useReportsSingle({
    id: currentReportId || undefined,
    enabled: Boolean(currentReportId),
  });

  const kassas = (reportData as any)?.kassas || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Joriy oy</h2>

      <ReportTotals data={totals} />

      <div className="h-[calc(100vh-400px)] scrollCastom">
        <DataTable
          columns={DetailColumns}
          data={kassas}
          isLoading={isLoading || !currentReportId}
          isRowClickble={true}
          onRowClick={(row) => {
            if (row?.id && currentReportId) {
              navigate(`/m-manager/reports-hub/monthly/${currentReportId}/info/${row.id}/info`);
            }
          }}
        />
      </div>
    </div>
  );
}
