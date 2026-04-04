import { DataTable } from "@/components/ui/data-table";
import { useNavigate } from "react-router-dom";
import ReportTotals from "../../report-finance/monthly/report-totals";
import { useYear } from "@/store/year-store";
import { DetailColumns } from "../monthly/report-detail/columns";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export default function CurrentMonthPage() {
  const navigate = useNavigate();
  const { year } = useYear();
  const currentMonth = new Date().getMonth() + 1;

  // Joriy oy kassalarini olish (kassa-reports endpoint)
  const { data: kassaData, isLoading } = useInfiniteQuery({
    queryKey: ["current-month-kassas", year, currentMonth],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<any, any>(apiRoutes.kassaReports, {
        year,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    initialPageParam: 1,
  });

  const flatKassas = kassaData?.pages?.flatMap((p: any) => p?.items || []) || [];

  // Joriy oy kassalarini filter — faqat hozirgi oy
  const currentMonthKassas = flatKassas.filter(
    (k: any) => k?.month === currentMonth && k?.year === year
  );

  // Kassa totals — kassa-reports/total
  const { data: totals } = useQuery({
    queryKey: ["current-month-totals"],
    queryFn: () => getAllData<any, any>(apiRoutes.kassaReportTotal, {}),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Joriy oy</h2>

      <ReportTotals data={totals} />

      <div className="h-[calc(100vh-400px)] scrollCastom">
        <DataTable
          columns={DetailColumns}
          data={currentMonthKassas.length ? currentMonthKassas : flatKassas}
          isLoading={isLoading}
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
