import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReports, useReportsTotal } from "./queries";
import ReportTotals from "./report-totals";
import ReportToolbar from "@/components/report-toolbar";
import ShadcnSelect from "@/components/Select";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useMeStore } from "@/store/me-store";
import { TKassareportData } from "../type";
import { IUserData, TResponse } from "@/types";
import { MonthsArray } from "@/consts";
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

export default function MonthlyReportsPage() {
  const { year, setYear } = useYear();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const {
    data,
    isLoading,
  } = useReports({
    queries: { year, limit: 12 },
  });

  const { data: totals } = useReportsTotal({
    queries: { year },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map((y) => ({ label: String(y), value: String(y) }));
  const gridTemplate = "4px max-content max-content max-content max-content max-content max-content max-content max-content max-content max-content 1fr 60px";
  const columnLabels = ["", "Oy", "Status", "Saldo", "Savdo", "Qarz", "Terminal", "Inkassa", "Hajm", "Foyda", "Chegirma", "", ""];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-[20px]">
        <ReportToolbar
          filterCols={1}
          hasActiveFilter={year !== currentYear}
          onClearFilters={() => setYear(currentYear)}
          filterContent={
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
              <ShadcnSelect
                value={String(year)}
                onChange={(v) => v && setYear(Number(v))}
                options={yearOptions}
                placeholder="Yil tanlang"
                className="bg-white h-[44px] rounded-[4px]"
              />
            </div>
          }
        />
      </div>

      <ReportTotals
        data={totals}
        onGreenCardClick={() => {}}
      />

      {/* Labellar + Listlar — bitta grid; har bir row subgrid bilan parent grid ustunlarini meros qiladi */}
      <div
        className="flex-1 min-h-0 overflow-auto scrollCastom mt-[20px]"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            columnGap: "24px",
            rowGap: "4px",
          }}
        >
          {/* Header labels — subgrid bilan rowlar bilan bir tekisda */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "subgrid",
              columnGap: "24px",
              paddingLeft: "10px",
              paddingRight: "10px",
              marginBottom: "6px",
            }}
          >
            {columnLabels.map((label, i) => (
              <span key={`label-${i}`} className={`text-[13px] text-[#A3A3A3] ${label === "Status" ? "text-center" : ""}`}>{label}</span>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]" style={{ gridColumn: "1 / -1" }}>
              <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
            </div>
          ) : (
            flatData.map((item: TKassareportData, i: number) => (
              <MonthlyRow
                key={item?.id || i}
                item={item}
                onRowClick={(item) => {
                  if (item?.id) {
                    const monthLabel = item?.month ? MonthsArray[item.month - 1]?.label : "Hisobot";
                    const path = `/m-manager/reports-hub/monthly/${item.id}/info`;
                    push(monthLabel || "Hisobot", path);
                    navigate(path);
                  }
                }}
              />
            ))
          )}
        </div>
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
  // Per-role badge — har role uchun o'z confirmation/rejection statusiga qarab.
  const perRoleBadge = (role: number): string => {
    if (role === 9) {
      if (item?.isManagerRejected) return "fail";
      if (item?.isMManagerConfirmed) return "success";
      return "none";
    }
    if (role === 10) {
      if (item?.isAccountantRejected) return "fail";
      if (item?.isAccountantConfirmed) return "success";
      return "none";
    }
    return "none";
  };

  const bothConfirmed = item?.isMManagerConfirmed && item?.isAccountantConfirmed;
  const isRejected = item?.isManagerRejected || item?.isAccountantRejected;

  // Yopilgan: yashil tayoqcha yashirinadi
  if (item?.status === "accepted" || bothConfirmed) {
    return {
      barColor: "transparent",
      showBar: false,
      showConfirmBtn: false,
      getBadgeStatus: perRoleBadge,
    };
  }

  if (isRejected) {
    return {
      barColor: "#EF5C12",
      showBar: true,
      showConfirmBtn: false,
      getBadgeStatus: perRoleBadge,
    };
  }

  // Default: yashil tayoqcha (open/normal)
  return {
    barColor: "#3ABC49",
    showBar: true,
    showConfirmBtn: false,
    getBadgeStatus: perRoleBadge,
  };
}

function MonthlyRow({ item, onRowClick }: { item: TKassareportData; onRowClick: (item: TKassareportData) => void }) {
  const { meUser } = useMeStore();
  const { data: usersData } = useQuery({
    queryKey: [apiRoutes.userManagersAccountants],
    queryFn: () =>
      getAllData<TResponse<IUserData>, object>(apiRoutes.userManagersAccountants, {}),
  });

  const role = meUser?.position?.role;
  const saldo = role === 9
    ? Number((item as any)?.managerSum || 0)
    : role === 10
      ? Number((item as any)?.accountantSum || (item as any)?.accauntantSum || 0)
      : (item?.inHand || 0);
  const monthName = item?.month ? MonthsArray[item.month - 1]?.label : "—";
  const sale = item?.sale ?? item?.totalSale ?? 0;
  const terminal = item?.plasticSum ?? item?.totalPlasticSum ?? 0;
  const debt = item?.debtSum ?? 0;
  const inkassa = item?.cashCollection ?? item?.totalCashCollection ?? 0;
  const hajm = item?.totalSize ?? 0;
  const foyda = item?.additionalProfitSum ?? 0;
  const chegirma = item?.discount ?? item?.totalDiscount ?? 0;

  const rowStatus = getRowStatus(item);

  return (
    <div
      onClick={() => onRowClick(item)}
      className="cursor-pointer hover:bg-gray-50 transition-colors items-center bg-white rounded-sm"
      style={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "subgrid",
        columnGap: "24px",
        paddingLeft: "10px",
        paddingRight: "10px",
        minHeight: 74,
      }}
    >
      {/* Tayoqcha */}
      {rowStatus.showBar ? (
        <div className="w-[2px] h-[30px] rounded-full" style={{ backgroundColor: rowStatus.barColor }} />
      ) : (
        <div />
      )}

      {/* Oy (kattaroq, saldo o'rnida) */}
      <span className="text-[15px] font-medium text-[#1a1a1a] whitespace-nowrap text-left">{monthName}</span>

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

      {/* Saldo (kichikroq, oy o'rnida) */}
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

      {/* Filler — 1fr ustun list kengligini saqlaydi */}
      <div />

      {/* Action */}
      <RowAction item={item} showConfirmBtn={rowStatus.showConfirmBtn} />
    </div>
  );
}

function RowAction({ item }: { item: TKassareportData; showConfirmBtn: boolean }) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const role = meUser?.position?.role;

  const { mutate: closeReport, isPending: isClosing } = useMutation({
    mutationFn: () =>
      PatchData(`${apiRoutes.reports}/${item?.id}/close`, {}),
    onSuccess: () => {
      toast.success("Yopildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
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

  // Yopish tugmasi: shu role ostida hali tasdiqlamagan bo'lsa
  const canClose =
    (role === 9 && !item?.isMManagerConfirmed) ||
    (role === 10 && !item?.isAccountantConfirmed);

  return (
    <div className="flex items-center justify-end gap-[4px]" onClick={(e) => e.stopPropagation()}>
      {canClose && (
        <button
          type="button"
          onClick={() => closeReport()}
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
