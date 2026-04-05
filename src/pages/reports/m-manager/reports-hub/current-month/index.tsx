import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useNavigate } from "react-router-dom";
import ReportTotals from "../../report-finance/monthly/report-totals";
import { useYear } from "@/store/year-store";
import { DetailColumns } from "../monthly/report-detail/columns";
import { useReports } from "../../report-finance/monthly/queries";
import { useQuery } from "@tanstack/react-query";
import { getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export default function CurrentMonthPage() {
  const navigate = useNavigate();
  const { year } = useYear();

  // Barcha reportlarni olish — eng yangi (joriy oy) birinchi keladi
  const { data: reportsData } = useReports({
    queries: { year, limit: 12 },
  });

  const allReports = reportsData?.pages?.flatMap((p) => p?.items || []) || [];

  // Joriy oy reportini topish — filialType = filial, eng yangi
  const currentReport = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    // Avval hozirgi oy va yilga mos reportni izlaymiz
    const found = allReports.find(
      (r: any) => r?.month === currentMonth && r?.year === year && r?.filialType === "filial"
    );
    // Topilmasa eng birinchisini olish
    return found || allReports.find((r: any) => r?.filialType === "filial") || allReports[0];
  }, [allReports, year]);

  // Report ID bilan to'liq ma'lumot olish (kassalar bilan)
  const { data: reportDetail, isLoading } = useQuery({
    queryKey: [apiRoutes.reports, currentReport?.id],
    queryFn: () => getByIdData<any, any>(apiRoutes.reports, currentReport?.id || ""),
    enabled: Boolean(currentReport?.id),
  });

  const kassas = reportDetail?.kassas || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Joriy oy</h2>

      <ReportTotals data={reportDetail || currentReport} />

      <div className="h-[calc(100vh-400px)] scrollCastom">
        <DataTable
          columns={DetailColumns}
          data={kassas}
          isLoading={isLoading || !currentReport?.id}
          isRowClickble={true}
          onRowClick={(row) => {
            if (row?.id) {
              navigate(`/m-manager/current-month/${row.id}/info`);
            }
          }}
        />
      </div>
    </div>
  );
}
