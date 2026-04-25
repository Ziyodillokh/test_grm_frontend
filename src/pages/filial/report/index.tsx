import { useNavigate, useParams } from "react-router-dom";
import { Loader, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import formatPrice from "@/utils/formatPrice";
import { useMeStore } from "@/store/me-store";

import { useFilialReports } from "@/pages/reports/m-manager/reports-hub/re-inventory/queries";
import { FilialReportItem } from "@/pages/reports/m-manager/reports-hub/re-inventory/type";

const gridTemplate = "40px 1fr 120px 100px 100px 120px 24px";
const columnLabels = ["№", "Sana", "Holati", "Soni", "Hajmi m²", "Summasi", ""];

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Ochiq", color: "#3ABC49" },
  accepted: { label: "Qabul qilingan", color: "#0078D4" },
  closed: { label: "Yopilgan", color: "#A3A3A3" },
  rejected: { label: "Rad etilgan", color: "#EF5C12" },
};

const safeFormat = (d: any, fmt = "dd.MM.yyyy") => {
  if (!d) return "—";
  try {
    return format(new Date(d), fmt);
  } catch {
    return "—";
  }
};

export default function SingleReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const { meUser } = useMeStore();

  const filialId = id === "my-filial" ? meUser?.filial?.id || "" : id || "";

  const { data, isLoading } = useFilialReports({
    filialId,
    queries: { limit: 50 },
    enabled: !!filialId,
  });

  const items: FilialReportItem[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];

  return (
    <div className="flex flex-col h-full p-4">
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
            <span className="text-[14px] text-[#a3a3a3]">Qayta ro'yxat ma'lumotlari topilmadi</span>
          </div>
        ) : (
          items.map((item, i) => {
            const st = statusMap[(item.status || "").toLowerCase()] || { label: "—", color: "#A3A3A3" };
            const dateStr = safeFormat(item.date);
            const createdStr = safeFormat(item.createdAt);

            return (
              <ListRow
                key={item.id}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={56}
                onClick={() => {
                  const path = `/filial/${id}/info/${item.id}/info?reportStatus=${(item.status || "").toLowerCase()}`;
                  push(dateStr, path);
                  navigate(path);
                }}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{dateStr}</span>
                  {createdStr && createdStr !== "—" && (
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
