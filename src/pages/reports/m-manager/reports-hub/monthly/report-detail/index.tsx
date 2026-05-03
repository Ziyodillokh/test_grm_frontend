import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useYear } from "@/store/year-store";
import ReportTotals from "../../../report-finance/monthly/report-totals";
import { TKassareportData } from "../../../report-finance/type";
import {
  useReportsSingle,
  useCashflowForMainManager,
  useReportDealer,
} from "./queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useMeStore } from "@/store/me-store";
import { IUserData, TResponse } from "@/types";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData, PatchData, UpdatePatchData } from "@/service/apiHelpers";
import TebleAvatar from "@/components/teble-avatar";
import { MoreVertical, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const reportTotalsData = useMemo(() => {
    if (!reportData) return undefined;
    return {
      ...reportData,
      totalIncome: cashflowData?.income ?? reportData?.totalIncome ?? 0,
      totalExpense: cashflowData?.expense ?? reportData?.totalExpense ?? 0,
    } as TKassareportData;
  }, [reportData, cashflowData]);

  const tableData = useMemo(() => {
    const rows: TKassareportData[] = [];

    if (dealerData?.[0]) {
      rows.push({
        isDealer: true,
        dealerReportId: dealerData[0]?.id,
        filial: { title: "Dillerlar" },
        inHand: dealerData[0]?.inHand || 0,
        totalSale: dealerData[0]?.totalSale || 0,
        totalPlasticSum: dealerData[0]?.totalPlasticSum || 0,
        debtSum: dealerData[0]?.debtSum || 0,
        totalCashCollection: dealerData[0]?.totalCashCollection || 0,
        totalSize: dealerData[0]?.debtSize || 0,
        additionalProfitSum: dealerData[0]?.debtProfitSum || 0,
        totalDiscount: dealerData[0]?.totalDiscount || 0,
        status: dealerData[0]?.status || "open",
        isMManagerConfirmed: dealerData[0]?.isMManagerConfirmed,
        isAccountantConfirmed: dealerData[0]?.isAccountantConfirmed,
      } as TKassareportData);
    }

    if (reportData?.kassas) {
      rows.push(...(reportData.kassas as TKassareportData[]));
    }

    return rows;
  }, [reportData, dealerData]);

  const gridTemplate = "4px 100px 100px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 60px";
  const columnLabels = ["", "Filial", "Status", "Saldo", "Savdo", "Qarz", "Terminal", "Inkassa", "Hajm", "Foyda", "Chegirma", ""];

  return (
    <div className="flex flex-col h-full">
      <ReportTotals
        data={reportTotalsData}
        onGreenCardClick={() => {
          if (id) {
            push("Kirim-Chiqimlar", `/m-manager/reports-hub/monthly/${id}/info/my?myCashFlow=true`);
            navigate(`/m-manager/reports-hub/monthly/${id}/info/my?myCashFlow=true`);
          }
        }}
      />

      {/* Labellar */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "10px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${label === "Status" ? "text-center" : ""}`}>{label}</span>
        ))}
      </div>

      {/* Listlar */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {tableData.map((item, i) => (
          <ReportRow key={item?.id || i} item={item} gridTemplate={gridTemplate} reportId={id} onRowClick={(item) => {
            if (item?.isDealer && item?.dealerReportId) {
              const path = `/m-manager/d-manager/report-monthly/${item.dealerReportId}/info`;
              push(item?.filial?.title || "Diller", path);
              navigate(path);
            } else if (item?.id) {
              const path = `/m-manager/reports-hub/monthly/${id}/info/${item.id}/info`;
              push(item?.filial?.title || item?.filial?.name || "Kassa", path);
              navigate(path);
            }
          }} />
        ))}
      </div>
    </div>
  );
}

function getRowStatus(item: TKassareportData): {
  barColor: string;
  showBar: boolean;
  showConfirmBtn: boolean;
  getBadgeStatus: (userRole: number) => string;
} {
  const bothConfirmed = item?.isMManagerConfirmed && item?.isAccountantConfirmed;
  const isRejected = item?.isManagerRejected || item?.isAccountantRejected;

  if (item?.status === "accepted" || bothConfirmed) {
    return {
      barColor: "transparent",
      showBar: false,
      showConfirmBtn: false,
      getBadgeStatus: () => "success",
    };
  }

  if (isRejected) {
    return {
      barColor: "#EF5C12",
      showBar: true,
      showConfirmBtn: false,
      getBadgeStatus: (role: number) => {
        if (role === 9 && item?.isManagerRejected) return "fail";
        if (role === 10 && item?.isAccountantRejected) return "fail";
        if (role === 9 && item?.isMManagerConfirmed) return "success";
        if (role === 10 && item?.isAccountantConfirmed) return "success";
        return "fail";
      },
    };
  }

  const isClosed = item?.status === "closed" || item?.status === "closed_by_d";
  if (isClosed) {
    return {
      barColor: "#FFA91E",
      showBar: true,
      showConfirmBtn: true,
      getBadgeStatus: (role: number) => {
        if (role === 9 && item?.isMManagerConfirmed) return "success";
        if (role === 10 && item?.isAccountantConfirmed) return "success";
        return "panding";
      },
    };
  }

  return {
    barColor: "#3ABC49",
    showBar: true,
    showConfirmBtn: false,
    getBadgeStatus: () => "none",
  };
}

function ReportRow({ item, onRowClick, gridTemplate, reportId: _reportId }: { item: TKassareportData; onRowClick: (item: TKassareportData) => void; gridTemplate: string; reportId?: string }) {
  const { data: usersData } = useQuery({
    queryKey: [apiRoutes.userManagersAccountants],
    queryFn: () =>
      getAllData<TResponse<IUserData>, object>(apiRoutes.userManagersAccountants, {}),
  });

  const saldo = item?.inHand || 0;
  const filialName = item?.isDealer ? "Dillerlar" : item?.filial?.title || "—";
  const sale = item?.sale ?? item?.totalSale ?? 0;
  const terminal = item?.plasticSum ?? item?.totalPlasticSum ?? 0;
  const debt = item?.debtSum ?? 0;
  const inkassa = item?.cashCollection ?? item?.totalCashCollection ?? 0;
  const hajm = item?.saleSize ?? item?.totalSaleSize ?? item?.totalSize ?? 0;
  const foyda = item?.additionalProfitSum ?? 0;
  const chegirma = item?.discountSum ?? item?.totalDiscountSum ?? item?.discount ?? item?.totalDiscount ?? 0;

  const rowStatus = getRowStatus(item);

  return (
    <ListRow
      gridTemplate={gridTemplate}
      gridGap="10px"
      onClick={() => onRowClick(item)}
    >
      {/* Tayoqcha */}
      {rowStatus.showBar ? (
        <div className="w-[2px] h-[30px] rounded-full" style={{ backgroundColor: rowStatus.barColor }} />
      ) : (
        <div />
      )}

      {/* Filial (kattaroq, saldo o'rnida) */}
      <span className="text-[15px] font-medium text-[#1a1a1a] whitespace-nowrap text-left">{filialName}</span>

      {/* Avatarlar */}
      <div className="flex items-center justify-center [&>*:not(:first-child)]:ml-[-8px]">
        {usersData?.items?.map((user: IUserData) => (
          <TebleAvatar
            key={user?.id}
            size={42}
            status={rowStatus.getBadgeStatus(user?.position?.role)}
            url={user?.avatar?.path}
            name={user?.firstName}
          />
        ))}
      </div>

      {/* Saldo (kichikroq, filial o'rnida) */}
      <span className={`text-[13px] font-medium whitespace-nowrap ${saldo === 0 ? "text-[#1a1a1a]" : saldo > 0 ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
        {saldo === 0 ? "0$" : saldo > 0 ? `+${saldo.toLocaleString()}$` : `${saldo.toLocaleString()}$`}
      </span>

      {/* Savdo */}
      <span className="text-[13px] text-[#1a1a1a]">{sale ? `${sale.toLocaleString()}$` : "0$"}</span>

      {/* Qarz */}
      <span className="text-[13px] text-[#1a1a1a]">{debt ? `${debt.toLocaleString()}$` : "0$"}</span>

      {/* Terminal */}
      <span className="text-[13px] text-[#0078D4]">{terminal ? `${terminal.toLocaleString()}$` : "0$"}</span>

      {/* Inkassa */}
      <span className="text-[13px] text-[#1a1a1a]">{inkassa ? `${inkassa.toLocaleString()}$` : "0$"}</span>

      {/* Hajm */}
      <span className="text-[13px] text-[#1a1a1a]">{hajm ? `${hajm.toFixed(0)} m²` : "0 m²"}</span>

      {/* Foyda */}
      <span className="text-[13px] text-[#47B13C]">{foyda ? `+${foyda.toLocaleString()}$` : "0$"}</span>

      {/* Chegirma */}
      <span className="text-[13px] text-[#EC6724]">{chegirma ? `-${Math.abs(chegirma).toLocaleString()}$` : "0$"}</span>

      {/* Action */}
      <RowAction item={item} showConfirmBtn={rowStatus.showConfirmBtn} />
    </ListRow>
  );
}

function RowAction({ item, showConfirmBtn }: { item: TKassareportData; showConfirmBtn: boolean }) {
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

  const canConfirm = showConfirmBtn && (
    item?.status === "closed" ||
    item?.status === "closed_by_d" ||
    (meUser?.position?.role == 10 && item?.isMManagerConfirmed) ||
    (meUser?.position?.role == 9 && item?.isAccountantConfirmed)
  );

  return (
    <div className="flex items-center justify-end gap-[4px]" onClick={(e) => e.stopPropagation()}>
      {canConfirm && (
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
