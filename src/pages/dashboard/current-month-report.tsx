import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import {
  useCashflowForMainManager,
  useReportDealer,
} from "@/pages/reports/m-manager/report-finance-single/queries";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { IUserData, TResponse } from "@/types";
import TebleAvatar from "@/components/teble-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import { MoreVertical, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CurrentMonthReport() {
  const navigate = useNavigate();
  const { meUser } = useMeStore();
  const pushBreadcrumb = useBreadcrumbStore((s) => s.push);

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
    enabled: Boolean(reportId) && Boolean(meUser?.id),
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
        totalSize: dealerData[0]?.debt_kv || 0,
        additionalProfitTotalSum:
          dealerData[0]?.debt_profit_sum || 0,
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

  // Bitta grid template — label va row bir xil ishlatadi
  const gridTemplate = "80px 100px 120px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 70px";
  const columnLabels = ["Saldo", "Status", "Holati", "Filial", "Savdo", "Terminal", "Qarz", "Inkassa", "Hajm", "Foyda", "Chegirma", ""];

  return (
    <div className="flex flex-col h-full">
      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        onGreenCardClick={() => {
          if (reportId) {
            pushBreadcrumb("Kirim-Chiqimlar", `/m-manager/report-finance/${reportId}/info/my?myCashFlow=true`);
            navigate(`/m-manager/report-finance/${reportId}/info/my?myCashFlow=true`);
          }
        }}
      />

      {/* Labellar — sticky, row bilan aynan bir xil grid */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "4px" }}
      >
        {columnLabels.map((label) => (
          <span key={label} className={`text-[13px] text-[#A3A3A3] ${label === "Status" || label === "Saldo" ? "text-center" : ""}`}>{label}</span>
        ))}
      </div>

      {/* Listlar — scroll */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {tableData.map((item, i) => (
          <ReportRow key={item?.id || i} item={item} gridTemplate={gridTemplate} onRowClick={(item) => {
            if (item?.isDealer && item?.dealerReportId) {
              const path = `/m-manager/d-manager/report-monthly/${item.dealerReportId}/info`;
              pushBreadcrumb(item?.filial?.title || "Diller", path);
              navigate(path);
            } else if (item?.id) {
              const path = `/m-manager/current-month/${item.id}/info`;
              pushBreadcrumb(item?.filial?.title || "Filial", path);
              navigate(path);
            }
          }} />
        ))}
      </div>
    </div>
  );
}

function getStatusBadge(item: TKassareportData): { label: string; color: string; hideBadge?: boolean } {
  if (item?.status === "accepted")
    return { label: "Tasdiqlangan", color: "#47B13C" };
  if (item?.isManagerRejected || item?.isAccountantRejected)
    return { label: "Qaytarilgan", color: "#EC6724" };
  if (item?.status === "closed_by_d")
    return { label: "D-Manager yopgan", color: "#0078D4" };
  if (item?.status === "warning" || item?.status === "open")
    return { label: "Jarayonda...", color: "#FFA91E", hideBadge: true };
  return { label: "Kutilayotgan", color: "#E38157" };
}

function ReportRow({ item, onRowClick, gridTemplate }: { item: TKassareportData; onRowClick: (item: TKassareportData) => void; gridTemplate: string }) {
  const { data: usersData } = useQuery({
    queryKey: [apiRoutes.userManagersAccountants],
    queryFn: () =>
      getAllData<TResponse<IUserData>, object>(apiRoutes.userManagersAccountants, {}),
  });

  const saldo = item?.in_hand || 0;
  const badge = getStatusBadge(item);
  const filialName = item?.isDealer ? "Dillerlar" : item?.filial?.title || "—";
  const sale = item?.sale ?? item?.totalSale ?? 0;
  const terminal = item?.plasticSum ?? item?.totalPlasticSum ?? 0;
  const debt = item?.debt_sum ?? 0;
  const inkassa = item?.cash_collection ?? item?.totalCashCollection ?? 0;
  const hajm = item?.totalSize ?? 0;
  const foyda = item?.additionalProfitTotalSum ?? 0;
  const chegirma = item?.discount ?? item?.totalDiscount ?? 0;

  return (
    <div
      className="items-center bg-white rounded-[8px] px-[12px] py-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
      style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "4px" }}
      onClick={() => onRowClick(item)}
    >
      {/* Saldo */}
      <span className={`text-[15px] whitespace-nowrap text-right ${saldo >= 0 ? "text-[#47B13C]" : "text-[#EC6724]"}`}>
        {saldo >= 0 ? "+" : ""}{saldo.toFixed(2)}
      </span>

      {/* Avatarlar */}
      <div className="flex items-center justify-center [&>*:not(:first-child)]:ml-[-12px]">
        {usersData?.items?.map((user: IUserData) => (
          <TebleAvatar
            key={user?.id}
            size={42}
            status={
              badge.hideBadge
                ? "none"
                : item?.status === "accepted" ||
                  (user?.position?.role == 9 && item?.isMManagerConfirmed) ||
                  (user?.position?.role == 10 && item?.isAccountantConfirmed)
                  ? "success"
                  : item?.isManagerRejected && user?.position?.role == 9
                    ? "fail"
                    : item?.isAccountantRejected && user?.position?.role == 10
                      ? "fail"
                      : "panding"
            }
            url={user?.avatar?.path}
            name={user?.firstName}
          />
        ))}
      </div>

      {/* Holati */}
      <div className="flex items-center gap-[6px]">
        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: badge.color }} />
        <span className="text-[13px]" style={{ color: badge.color }}>{badge.label}</span>
      </div>

      {/* Filial */}
      <span className="text-[13px] text-[#1a1a1a]">{filialName}</span>

      {/* Savdo */}
      <span className="text-[13px] text-[#A3A3A3]">{sale.toLocaleString()}$</span>

      {/* Terminal */}
      <span className="text-[13px] text-[#0078D4]">{terminal.toLocaleString()}$</span>

      {/* Qarz */}
      <span className="text-[13px] text-[#A3A3A3]">{debt.toLocaleString()}$</span>

      {/* Inkassa */}
      <span className="text-[13px] text-[#A3A3A3]">{inkassa.toLocaleString()}$</span>

      {/* Hajm */}
      <span className="text-[13px] text-[#A3A3A3]">{hajm.toFixed(0)} m²</span>

      {/* Foyda */}
      <span className="text-[13px] text-[#47B13C]">+{foyda.toFixed(2)}$</span>

      {/* Chegirma */}
      <span className="text-[13px] text-[#EC6724]">-{Math.abs(chegirma).toFixed(2)}$</span>

      {/* Action */}
      <RowAction item={item} />
    </div>
  );
}

function RowAction({ item }: { item: TKassareportData }) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();

  const { mutate: confirm, isPending: isConfirming } = useMutation({
    mutationFn: () =>
      PatchData(
        item?.isDealer && item?.dealerReportId
          ? `${apiRoutes.reports}/${item.dealerReportId}/close-dealer`
          : apiRoutes.kassaReports + "/" + item?.id,
        {}
      ),
    onSuccess: () => {
      toast.success("Tasdiqlandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reportsDealer] });
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: () =>
      UpdatePatchData(apiRoutes.kassaReports + "/reject", item?.id || "", {}),
    onSuccess: () => {
      toast.success("Qaytarildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    },
  });

  const showConfirm =
    item?.status === "closed" ||
    item?.status === "closed_by_d" ||
    (meUser?.position?.role == 10 && item?.isMManagerConfirmed) ||
    (meUser?.position?.role == 9 && item?.isAccountantConfirmed);

  return (
    <div className="flex items-center justify-end gap-[4px]" onClick={(e) => e.stopPropagation()}>
      {showConfirm && (
        <button
          onClick={() => confirm()}
          disabled={isConfirming}
          className="w-[42px] h-[42px] rounded-full bg-[#47B13C] flex items-center justify-center shrink-0 hover:bg-[#3da032] transition-colors disabled:opacity-50"
        >
          {isConfirming ? (
            <Loader className="w-[18px] h-[18px] text-white animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_check)">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 3L9 10.5075L6.75 8.2575" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip_check"><rect width="18" height="18" fill="white"/></clipPath>
              </defs>
            </svg>
          )}
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
            <MoreVertical className="w-[16px] h-[16px] text-[#A3A3A3]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={isRejecting} onClick={() => reject()}>
            {isRejecting ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            Qaytarish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
