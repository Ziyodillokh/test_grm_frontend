import { useNavigate, useParams } from "react-router-dom";
import { Loader, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import formatPrice from "@/utils/formatPrice";
import { apiRoutes } from "@/service/apiRoutes";

import { useFilialReports, useOpenFilialReport } from "./queries";
import { FilialReportItem } from "./type";

const gridTemplate = "40px 1fr 120px 100px 100px 120px 24px";
const columnLabels = ["№", "Sana", "Holati", "Soni", "Hajmi m²", "Summasi", ""];

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Ochiq", color: "#3ABC49" },
  accepted: { label: "Qabul qilingan", color: "#0078D4" },
  closed: { label: "Yopilgan", color: "#A3A3A3" },
  rejected: { label: "Rad etilgan", color: "#EF5C12" },
};

export default function ReInventoryDetailPage() {
  const { filialId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const push = useBreadcrumbStore((s) => s.push);

  const { data, isLoading } = useFilialReports({
    filialId: filialId || "",
    queries: { limit: 50 },
    enabled: !!filialId,
  });

  const items: FilialReportItem[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];

  const hasActiveReport = items.some(
    (it) => ["open", "closed", "rejected"].includes((it.status || "").toLowerCase()),
  );

  const { mutate: openReport, isPending: opening } = useOpenFilialReport();

  const handleOpenPereuchot = () => {
    if (!filialId) return;
    openReport(filialId, {
      onSuccess: () => {
        toast.success("Qayta ro'yxat ochildi");
        queryClient.invalidateQueries({ queryKey: [apiRoutes.filialReport, filialId] });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Qayta ro'yxatni ochib bo'lmadi");
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar: Pereuchot ochish */}
      <div className="mb-[10px] flex items-center">
        {!hasActiveReport && (
          <button
            onClick={handleOpenPereuchot}
            disabled={opening}
            className="ml-auto h-[34px] px-[14px] rounded-sm bg-[#3ABC49] text-white text-[13px] font-medium flex items-center gap-[4px] hover:bg-[#33a942] transition-colors disabled:opacity-50"
          >
            {opening ? <Loader className="w-[16px] h-[16px] animate-spin" /> : <Plus className="w-[16px] h-[16px]" />}
            Qayta ro'yxat ochish
          </button>
        )}
      </div>

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="text-[14px] text-[#a3a3a3]">Pereuchot ma'lumotlari topilmadi</span>
          </div>
        ) : (
          items.map((item, i) => {
            const st = statusMap[(item.status || "").toLowerCase()] || { label: "—", color: "#A3A3A3" };
            const dateStr = item.date
              ? format(new Date(item.date), "dd.MM.yyyy")
              : "���";
            const createdStr = item.createdAt
              ? format(new Date(item.createdAt), "dd.MM.yyyy")
              : "";

            return (
              <ListRow
                key={item.id}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={56}
                onClick={() => {
                  const path = `/m-manager/reports-hub/re-inventory/${filialId}/${item.id}`;
                  push(dateStr, path);
                  navigate(path);
                }}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{dateStr}</span>
                  {createdStr && (
                    <span className="text-[11px] text-[#a3a3a3]">Yaratilgan: {createdStr}</span>
                  )}
                </div>
                <div className="flex items-center gap-[6px]">
                  <span
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-[13px] text-[#1a1a1a]">{st.label}</span>
                </div>
                <span className="text-[13px] text-[#1a1a1a]">{formatPrice(item.count || 0)}</span>
                <span className="text-[13px] text-[#1a1a1a]">{formatPrice(Number(item.volume || 0))} m²</span>
                <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(Number(item.cost || 0))} $</span>
                <ChevronRight className="w-[18px] h-[18px] text-[#a3a3a3]" />
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
