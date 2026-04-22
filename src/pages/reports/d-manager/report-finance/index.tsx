import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import { useQuery } from "@tanstack/react-query";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { MonthsArray } from "@/consts";
import { Loader } from "lucide-react";
import TebleAvatar from "@/components/teble-avatar";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { IUserData, TResponse } from "@/types";

import { useReports, useReportsTotal } from "./queries";
import ReportTotals from "./report-totals";
import { TKassareportData } from "./type";

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
  const { data: usersData } = useQuery({
    queryKey: [apiRoutes.userManagersAccountants],
    queryFn: () =>
      getAllData<TResponse<IUserData>, object>(apiRoutes.userManagersAccountants, {}),
  });

  const monthName = item?.month ? MonthsArray[item.month - 1]?.label : "—";
  const naqd = item?.in_hand ?? 0;
  const terminal = item?.totalPlasticSum ?? item?.plasticSum ?? 0;
  const hajm = item?.debt_kv ?? item?.totalSize ?? 0;
  const chegirma = item?.discount ?? item?.totalDiscount ?? 0;
  const yuborilgan = item?.debt_sum ?? 0;
  const qarzdorlik = item?.dealer_frozen_owed ?? 0;

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

      {/* Action placeholder */}
      <div />
    </ListRow>
  );
}
