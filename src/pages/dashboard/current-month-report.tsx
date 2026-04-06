import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { DetailColumns } from "@/pages/reports/m-manager/reports-hub/monthly/report-detail/columns";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import {
  useCashflowForMainManager,
  useReportDealer,
} from "@/pages/reports/m-manager/report-finance-single/queries";
import { Monitor } from "lucide-react";
import { useMeStore } from "@/store/me-store";

export default function CurrentMonthReport() {
  const navigate = useNavigate();
  const { meUser } = useMeStore();

  // Joriy oy reportini olish (GET /reports/current)
  const { data: reportData, isLoading } = useQuery({
    queryKey: [apiRoutes.reports, "current"],
    queryFn: () =>
      getAllData<TKassareportData, object>(apiRoutes.reports + "/current", {}),
  });

  const reportId = reportData?.id;

  // Manager cashflow (prixod/rasxod) — faqat o'z cashflowlarim
  const { data: cashflowData } = useCashflowForMainManager({
    id: reportId,
    enabled: Boolean(reportId),
    userId: meUser?.id,
  });

  // Dealer
  const { data: dealerData } = useReportDealer({
    enabled: Boolean(reportData),
    queries: {
      month: reportData?.month,
      year: reportData?.year,
    },
  });

  // Yashil card uchun — prixod/rasxod manager cashflowdan olinadi
  const reportTotalsData = useMemo(() => {
    if (!reportData) return undefined;
    return {
      ...reportData,
      totalIncome: cashflowData?.income ?? reportData?.totalIncome ?? 0,
      totalExpense: cashflowData?.expense ?? reportData?.totalExpense ?? 0,
    } as TKassareportData;
  }, [reportData, cashflowData]);

  // Jadval datasi — filial kassalari + dealer
  const tableData = useMemo(() => {
    const rows: TKassareportData[] = [];

    // Dealer row
    if (dealerData?.[0]) {
      rows.push({
        isDealer: true,
        dealerReportId: dealerData[0]?.id,
        filial: { title: "Dillerlar" },
        in_hand: dealerData[0]?.in_hand || 0,
        totalSale: dealerData[0]?.totalSale || 0,
        totalPlasticSum: dealerData[0]?.totalPlasticSum || 0,
        debt_sum: dealerData[0]?.debt_sum || 0,
        totalCashCollection: dealerData[0]?.totalCashCollection || 0,
        totalSize: dealerData[0]?.totalSize || 0,
        additionalProfitTotalSum:
          dealerData[0]?.additionalProfitTotalSum || 0,
        totalDiscount: dealerData[0]?.totalDiscount || 0,
        status: dealerData[0]?.status || "open",
        isMManagerConfirmed: dealerData[0]?.isMManagerConfirmed,
        isAccountantConfirmed: dealerData[0]?.isAccountantConfirmed,
      } as TKassareportData);
    }

    // Filial kassalari
    if (reportData?.kassas) {
      rows.push(...(reportData.kassas as TKassareportData[]));
    }

    return rows;
  }, [reportData, dealerData]);

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Monitor className="w-5 h-5" />
        <span className="text-foreground font-semibold text-lg">Joriy Oy</span>
      </div>

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        onGreenCardClick={() => {
          if (reportId) {
            navigate(`/m-manager/report-finance/${reportId}/my?myCashFlow=true`);
          }
        }}
      />

      {/* Filial kassalari jadvali */}
      <div className="h-[calc(100vh-400px)] scrollCastom">
        <DataTable
          columns={DetailColumns}
          data={tableData}
          isLoading={isLoading}
          isRowClickble={true}
          onRowClick={(item) => {
            if (item?.isDealer && item?.dealerReportId) {
              navigate(
                `/m-manager/d-manager/report-monthly/${item.dealerReportId}/info`
              );
            } else if (item?.id) {
              navigate(`/m-manager/current-month/${item.id}/info`);
            }
          }}
        />
      </div>
    </div>
  );
}
