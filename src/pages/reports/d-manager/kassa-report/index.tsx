import { useNavigate, useParams } from "react-router-dom";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { Loader } from "lucide-react";
import TebleAvatar from "@/components/teble-avatar";
import { useMeStore } from "@/store/me-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { toast } from "sonner";

import { useKassaReports } from "./queries";
import { TKassareportData } from "./type";
import { useReportsSingle } from "../../m-manager/report-finance-single/queries";
import { useYear } from "@/store/year-store";
import ReportTotals from "../report-finance/report-totals";
import ActionBadge from "@/components/actionBadge";
import ReportToolbar from "@/components/report-toolbar";

export default function PageKassaReport() {
  const { id } = useParams();
  const { year } = useYear();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const { data: reportData } = useReportsSingle({
    id,
    enabled: Boolean(id),
    queries: {},
  });

  const { data, isLoading } = useKassaReports({
    queries: { reportId: id, year },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // Oyni yopish — PATCH /reports/:id/close-dealer
  const canClose = reportData?.status === "open" || reportData?.status === "Open";
  const alreadyClosed = reportData?.status === "closed_by_d" || reportData?.status === "closed" || reportData?.status === "accepted";

  const { mutate: closeMonth, isPending: isClosing } = useMutation({
    mutationFn: () =>
      PatchData(apiRoutes.reports + "/" + id + "/close-dealer", {}),
    onSuccess: () => {
      toast.success("Oy yopildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const gridTemplate = "4px 1fr 60px 1fr 1fr 1fr 1fr 50px";
  const columnLabels = ["", "Diller", "", "Naqd", "Terminal", "Yuborilgan", "Qarzdorlik", ""];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar: search + sort + oyni yopish button */}
      <div className="flex items-center gap-[4px] mb-[10px]">
        <ReportToolbar />
        <div className="ml-auto">
          {canClose && (
            <button
              onClick={() => closeMonth()}
              disabled={isClosing}
              className="h-[42px] px-[20px] rounded-sm bg-[#47B13C] text-white text-[14px] font-medium flex items-center gap-[8px] hover:bg-[#3da032] transition-colors disabled:opacity-50"
            >
              {isClosing && <Loader className="w-4 h-4 animate-spin" />}
              Oyni yopish
            </button>
          )}
          {alreadyClosed && (
            <span className="h-[42px] px-[20px] rounded-sm bg-[#e8e8e8] text-[#1a1a1a] text-[14px] font-medium flex items-center opacity-60">
              {reportData?.status === "accepted" ? "Tasdiqlangan" : "Yopilgan"}
            </span>
          )}
        </div>
      </div>

      <ReportTotals data={reportData as any} />

      {/* Column labels */}
      <div
        className="mt-[10px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      {/* Kassa rows */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          flatData.map((item: TKassareportData, i: number) => (
            <KassaRow
              key={item?.id || i}
              item={item}
              gridTemplate={gridTemplate}
              onRowClick={(item) => {
                if (item?.id) {
                  const title = item?.filial?.title || "Diller";
                  const isMM = window.location.pathname.startsWith("/m-manager/");
                  const path = isMM
                    ? `/m-manager/d-manager/report-monthly/${id}/info/${item.id}/info`
                    : `/d-manager/reports-hub/monthly/${id}/info/${item.id}/info`;
                  push(title, path);
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

function KassaRow({ item, gridTemplate, onRowClick }: { item: TKassareportData; gridTemplate: string; onRowClick: (item: TKassareportData) => void }) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();

  const filialTitle = item?.filial?.title || "—";
  const naqd = item?.inHand ?? 0;
  const terminal = item?.totalPlasticSum ?? item?.plasticSum ?? 0;
  const yuborilgan = item?.debtSum ?? 0;
  const qarzdorlik = item?.kassaStatus === 2 ? (item?.filial?.owed ?? 0) : (item?.frozenOwed ?? 0);

  const statusText = item?.kassaStatus === 2
    ? "willSell"
    : item?.status || "open";

  const { mutate: closeDmanager, isPending } = useMutation({
    mutationFn: () =>
      PatchData(apiRoutes.kassaReports + "/" + item?.id + "/close-dmanager", {}),
    onSuccess: () => {
      toast.success("Tasdiqlandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
    },
  });

  return (
    <ListRow gridTemplate={gridTemplate} onClick={() => onRowClick(item)}>
      {/* Status bar */}
      {item?.status === "open" ? (
        <div className="w-[2px] h-[30px] rounded-full bg-[#3ABC49]" />
      ) : item?.status === "rejected" ? (
        <div className="w-[2px] h-[30px] rounded-full bg-[#EF5C12]" />
      ) : (
        <div />
      )}

      {/* Diller nomi */}
      <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{filialTitle}</span>

      {/* Avatar */}
      <div className="flex items-center justify-start">
        <TebleAvatar
          size={42}
          status={item?.status === "open" ? "panding" : item?.status === "rejected" ? "fail" : "success"}
          url={meUser?.avatar?.path}
          name={meUser?.firstName || "A"}
        />
      </div>

      {/* Naqd */}
      <span className="text-[13px] text-[#1a1a1a]">{naqd ? `${naqd.toLocaleString()}$` : "0$"}</span>

      {/* Terminal */}
      <span className="text-[13px] text-[#0078D4]">{terminal ? `${terminal.toLocaleString()}$` : "0$"}</span>

      {/* Yuborilgan */}
      <span className="text-[13px] text-[#1a1a1a]">{yuborilgan ? `${yuborilgan.toLocaleString()}$` : "0$"}</span>

      {/* Qarzdorlik */}
      <span className="text-[13px] text-[#EC6724]">{qarzdorlik ? `${qarzdorlik.toLocaleString()}$` : "0$"}</span>

      {/* Action */}
      <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
        {item?.kassaStatus === 2 ? (
          <ActionBadge status="willSell" />
        ) : item?.status === "open" ? (
          <button
            onClick={() => closeDmanager()}
            disabled={isPending}
            className="w-[36px] h-[36px] rounded-full bg-[#47B13C] flex items-center justify-center shrink-0 hover:bg-[#3da032] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader className="w-[16px] h-[16px] text-white animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 3L9 10.5075L6.75 8.2575" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ) : (
          <ActionBadge status={statusText} />
        )}
      </div>
    </ListRow>
  );
}
