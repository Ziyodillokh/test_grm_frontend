import { useNavigate, useParams } from "react-router-dom";
import { useYear } from "@/store/year-store";
import {
  useReportsSingle,
  useCashflowForMainManager,
  useReportDealer,
} from "./queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import MonthlyReportView from "@/pages/reports/m-manager/_shared/monthly-report-view";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const { year } = useYear();

  const { data: reportData } = useReportsSingle({
    id,
    enabled: Boolean(id),
    queries: { year, page: 1 },
  });

  const { data: cashflowData } = useCashflowForMainManager({
    id,
    enabled: Boolean(id),
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
      onGreenCardClick={() => {
        if (id) {
          const path = `/m-manager/reports-hub/monthly/${id}/info/my?myCashFlow=true`;
          push("Kirim-Chiqimlar", path);
          navigate(path);
        }
      }}
      onRowClick={(item) => {
        if (item?.isDealer && item?.dealerReportId) {
          const path = `/m-manager/d-manager/report-monthly/${item.dealerReportId}/info`;
          push(item?.filial?.title || "Diller", path);
          navigate(path);
        } else if (item?.id) {
          const path = `/m-manager/reports-hub/monthly/${id}/info/${item.id}/info`;
          push(item?.filial?.title || item?.filial?.name || "Kassa", path);
          navigate(path);
        }
      }}
    />
  );
}
