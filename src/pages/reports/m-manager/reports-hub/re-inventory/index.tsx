import { useNavigate } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader, ChevronRight } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import formatPrice from "@/utils/formatPrice";
import ReportToolbar from "@/components/report-toolbar";

import { useFilialReportFilials } from "./queries";
import { FilialWithReport } from "./type";

const gridTemplate = "40px 1fr 120px 100px 100px 120px 24px";
const columnLabels = ["№", "Nomi", "Holati", "Soni", "Hajmi m²", "Summasi", ""];

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Ochiq", color: "#3ABC49" },
  accepted: { label: "Qabul qilingan", color: "#0078D4" },
  closed: { label: "Yopilgan", color: "#A3A3A3" },
  rejected: { label: "Rad etilgan", color: "#EF5C12" },
};

export default function ReInventoryFilialsPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const [search] = useQueryState("search", parseAsString);

  const { data, isLoading } = useFilialReportFilials({
    queries: { search: search || undefined, limit: 100 },
  });

  const items: FilialWithReport[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar />

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
        ) : (
          items.map((item, i) => {
            const st = statusMap[(item.lastReportStatus || "").toLowerCase()] || { label: "—", color: "#A3A3A3" };
            return (
              <ListRow
                key={item.id}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={56}
                onClick={() => {
                  const path = `/m-manager/reports-hub/re-inventory/${item.id}`;
                  push(item.title || "Filial", path);
                  navigate(path);
                }}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{item.title}</span>
                  <span className="text-[11px] text-[#a3a3a3]">
                    {item.type === "warehouse" ? "Sklad" : "Filial"}
                  </span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-[13px] text-[#1a1a1a]">{st.label}</span>
                </div>
                <span className="text-[13px] text-[#1a1a1a]">
                  {item.lastReportCount != null ? formatPrice(item.lastReportCount) : "—"}
                </span>
                <span className="text-[13px] text-[#1a1a1a]">
                  {item.lastReportVolume != null ? `${formatPrice(Number(item.lastReportVolume))} m²` : "—"}
                </span>
                <span className="text-[13px] font-medium text-[#1a1a1a]">
                  {item.lastReportCost != null ? `${formatPrice(Number(item.lastReportCost))} $` : "—"}
                </span>
                <ChevronRight className="w-[18px] h-[18px] text-[#a3a3a3]" />
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
