import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import ReportTotals from "../../../report-finance/monthly/report-totals";
import { TKassareportData } from "../../../report-finance/type";
import { DetailColumns } from "./columns";
import {
  useReportsSingle,
  useCashflowForMainManager,
  useReportDealer,
} from "./queries";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { year } = useYear();

  const { data: reportData, isLoading } = useReportsSingle({
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

  // Yashil card uchun — prixod/rasxod manager cashflowdan olinadi
  const reportTotalsData = useMemo(() => {
    if (!reportData) return undefined;
    return {
      ...reportData,
      totalIncome: cashflowData?.income ?? reportData?.totalIncome ?? 0,
      totalExpense: cashflowData?.expense ?? reportData?.totalExpense ?? 0,
    } as TKassareportData;
  }, [reportData, cashflowData]);

  // Jadval datasi — filial kassalari + dealer (oddiy ro'yxat)
  const tableData = useMemo(() => {
    const rows: TKassareportData[] = [];

    // Dealer row (hozircha oddiy ro'yxat sifatida)
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
        additionalProfitTotalSum: dealerData[0]?.additionalProfitTotalSum || 0,
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

  const monthName = reportData?.month
    ? MonthsArray[reportData.month - 1]?.label
    : "";

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => navigate("/m-manager/reports-hub")}
        >
          Hisobotlar
        </span>
        <span>•</span>
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => navigate("/m-manager/reports-hub/monthly")}
        >
          Oylik Hisobotlar
        </span>
        <span>•</span>
        <span className="text-foreground font-medium">{monthName}</span>
      </div>

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        onGreenCardClick={() =>
          navigate(`/m-manager/reports-hub/monthly/${id}/info/my`)
        }
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
              navigate(
                `/m-manager/reports-hub/monthly/${id}/info/${item.id}/info`
              );
            }
          }}
        />
      </div>
    </div>
  );
}
