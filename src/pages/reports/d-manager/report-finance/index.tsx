import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { MonthsArray } from "@/consts";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import TebleAvatar from "@/components/teble-avatar";
import { getAllData, PatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { IUserData, TResponse } from "@/types";

import { useReports, useReportsTotal } from "./queries";
import ReportTotals from "./report-totals";
import { TKassareportData } from "./type";
import ReportToolbar from "@/components/report-toolbar";
import ActionBadge from "@/components/actionBadge";

export default function PageFinance() {
  const { year } = useYear();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const { data, isLoading } = useReports({
    queries: { page: 1, filialType: "dealer", year, limit: 12 },
  });

  const { data: totals } = useReportsTotal({
    queries: { year, filialType: "dealer" },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const gridTemplate = "4px 80px 100px 1fr 1fr 1fr 1fr 1fr 1fr 50px";
  const columnLabels = ["", "Oy", "Status", "Naqd", "Terminal", "Hajm", "Chegirma", "Yuborilgan", "Qarzdorlik", ""];

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar />
      <ReportTotals data={totals} />

      {/* Column labels */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${label === "Status" ? "text-center" : ""}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Month rows */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          flatData.map((item: TKassareportData, i: number) => (
            <MonthlyRow
              key={item?.id || i}
              item={item}
              gridTemplate={gridTemplate}
              onRowClick={(item) => {
                if (item?.id) {
                  const monthLabel = item?.month ? MonthsArray[item.month - 1]?.label : "Hisobot";
                  const path = `/d-manager/reports-hub/monthly/${item.id}/info`;
                  push(monthLabel || "Hisobot", path);
                  navigate(path);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function getRowStatus(item: TKassareportData): {
  barColor: string;
  showBar: boolean;
  getBadgeStatus: (userRole: number) => string;
} {
  const bothConfirmed = item?.isMManagerConfirmed && item?.isAccountantConfirmed;
  const isRejected = item?.isManagerRejected || item?.isAccountantRejected;

  if (item?.status === "accepted" || bothConfirmed) {
    return {
      barColor: "transparent",
      showBar: false,
      getBadgeStatus: () => "success",
    };
  }

  if (isRejected) {
    return {
      barColor: "#EF5C12",
      showBar: true,
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
    getBadgeStatus: () => "none",
  };
}

function MonthlyRow({
  item,
  onRowClick,
  gridTemplate,
}: {
  item: TKassareportData;
  onRowClick: (item: TKassareportData) => void;
  gridTemplate: string;
}) {
  const queryClient = useQueryClient();
  const { data: usersData } = useQuery({
    queryKey: [apiRoutes.userManagersAccountants],
    queryFn: () =>
      getAllData<TResponse<IUserData>, object>(apiRoutes.userManagersAccountants, {}),
  });

  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;
  const isPastMonth =
    (item?.year ?? curY) < curY ||
    ((item?.year ?? curY) === curY && (item?.month ?? curM) < curM);
  // Status hanuz "open" (DB'da legacy '1' yoki yangi 'open') — closed/accepted/rejected emas
  const isOpenStatus =
    !item?.status ||
    item?.status === "open" ||
    item?.status === "1" ||
    !["accepted", "closed", "closed_by_d", "rejected", "warning"].includes(
      item?.status as string,
    );
  const canClose = isOpenStatus && isPastMonth;

  const { mutate: closeMonth, isPending: isClosing } = useMutation({
    mutationFn: () =>
      PatchData(apiRoutes.reports + "/" + (item?.id || "") + "/close-dealer", {}),
    onSuccess: () => {
      toast.success("Oy yopildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const monthName = item?.month ? MonthsArray[item.month - 1]?.label : "—";
  const naqd = item?.inHand ?? 0;
  const terminal = item?.totalPlasticSum ?? item?.plasticSum ?? 0;
  const hajm = item?.debtSize ?? item?.totalSize ?? 0;
  const chegirma = item?.discount ?? item?.totalDiscount ?? 0;
  const yuborilgan = item?.debtSum ?? 0;
  const qarzdorlik = item?.frozenOwed ?? 0;

  const rowStatus = getRowStatus(item);

  return (
    <ListRow gridTemplate={gridTemplate} onClick={() => onRowClick(item)}>
      {/* Status bar */}
      {rowStatus.showBar ? (
        <div className="w-[2px] h-[30px] rounded-full" style={{ backgroundColor: rowStatus.barColor }} />
      ) : (
        <div />
      )}

      {/* Oy */}
      <span className="text-[13px] font-medium text-[#1a1a1a]">{monthName}</span>

      {/* M-manager & Accountant avatarlari */}
      <div className="flex items-center justify-start [&>*:not(:first-child)]:ml-[-8px]">
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

      {/* Naqd */}
      <span className="text-[13px] text-[#1a1a1a]">{naqd ? `${naqd.toLocaleString()}$` : "0$"}</span>

      {/* Terminal */}
      <span className="text-[13px] text-[#0078D4]">{terminal ? `${terminal.toLocaleString()}$` : "0$"}</span>

      {/* Hajm */}
      <span className="text-[13px] text-[#1a1a1a]">{hajm ? `${hajm.toFixed(0)} m²` : "0 m²"}</span>

      {/* Chegirma */}
      <span className="text-[13px] text-[#EC6724]">{chegirma ? `-${Math.abs(chegirma).toLocaleString()}$` : "0$"}</span>

      {/* Yuborilgan */}
      <span className="text-[13px] text-[#1a1a1a]">{yuborilgan ? `${yuborilgan.toLocaleString()}$` : "0$"}</span>

      {/* Qarzdorlik */}
      <span className="text-[13px] text-[#1a1a1a]">{qarzdorlik ? `${qarzdorlik.toLocaleString()}$` : "0$"}</span>

      {/* Action — statusga qarab */}
      <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
        {item?.status === "accepted" ? (
          <ActionBadge status="success" />
        ) : (item?.isManagerRejected || item?.isAccountantRejected) ? (
          <ActionBadge status="fail" />
        ) : item?.status === "closed_by_d" || item?.status === "closed" ? (
          <ActionBadge status="panding" />
        ) : canClose ? (
          <button
            type="button"
            onClick={() => closeMonth()}
            disabled={isClosing}
            className="h-[40px] px-[14px] rounded-full flex items-center gap-[6px] text-[13px] font-medium transition-colors bg-white text-[#47B13C] hover:bg-[#47B13C]/10 disabled:opacity-50"
          >
            {isClosing ? (
              <Loader className="w-[16px] h-[16px] animate-spin" />
            ) : (
              <span className="w-[16px] h-[16px] flex items-center justify-center shrink-0 text-[#47B13C]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.99984 7.33464L7.99984 9.33464L13.3332 4.0013M13.3332 8.0013V12.0013C13.3332 12.3549 13.1927 12.6941 12.9426 12.9441C12.6926 13.1942 12.3535 13.3346 11.9998 13.3346H3.99984C3.64622 13.3346 3.30708 13.1942 3.05703 12.9441C2.80698 12.6941 2.6665 12.3549 2.6665 12.0013V4.0013C2.6665 3.64768 2.80698 3.30854 3.05703 3.05849C3.30708 2.80844 3.64622 2.66797 3.99984 2.66797H9.99984" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <span>Yopish</span>
          </button>
        ) : isOpenStatus ? (
          <span className="text-[13px] text-[#47B13C]">Jarayonda...</span>
        ) : (
          <div />
        )}
      </div>
    </ListRow>
  );
}
