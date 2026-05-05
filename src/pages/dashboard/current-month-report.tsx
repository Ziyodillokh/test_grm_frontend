import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import {
  useCashflowForMainManager,
  useReportDealer,
} from "@/pages/reports/m-manager/report-finance-single/queries";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import MonthlyReportView from "@/pages/reports/m-manager/_shared/monthly-report-view";

export default function CurrentMonthReport() {
  const navigate = useNavigate();
  const { meUser } = useMeStore();
  const pushBreadcrumb = useBreadcrumbStore((s) => s.push);

  const { data: reportData } = useQuery({
    queryKey: [apiRoutes.reports, "current"],
    queryFn: () =>
      getAllData<TKassareportData, object>(apiRoutes.reports + "/current", {}),
  });

  const reportId = reportData?.id;

  const { data: cashflowData } = useCashflowForMainManager({
    id: reportId,
    enabled: Boolean(reportId) && Boolean(meUser?.id),
    userId: meUser?.id,
  });

  const { data: dealerData } = useReportDealer({
    enabled: Boolean(reportData),
    queries: {
      month: reportData?.month,
      year: reportData?.year,
    },
  });

  return (
    <MonthlyReportView
      reportData={reportData}
      cashflow={cashflowData}
      dealer={dealerData?.[0]}
      showToolbar={false}
      onGreenCardClick={() => {
        if (reportId) {
          const path = `/m-manager/report-finance/${reportId}/info/my?myCashFlow=true`;
          pushBreadcrumb("Kirim-Chiqimlar", path);
          navigate(path);
        }
      }}
      onRowClick={(item) => {
        if (item?.isDealer && item?.dealerReportId) {
          const path = `/m-manager/d-manager/report-monthly/${item.dealerReportId}/info`;
          pushBreadcrumb(item?.filial?.title || "Diller", path);
          navigate(path);
        } else if (item?.id) {
          const path = `/m-manager/current-month/${item.id}/info`;
          pushBreadcrumb(item?.filial?.title || "Filial", path);
          navigate(path);
        }
      }}
    />
  );
}
