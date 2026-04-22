import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import formatPrice from "@/utils/formatPrice";
import ReportToolbar from "@/components/report-toolbar";

import { useReInventoryItems, useReInventoryTotals } from "./queries";
import { ReInventoryItem } from "./type";

const tabs = [
  { key: undefined, label: "Hammasi" },
  { key: "переучет", label: "Pereuchot" },
  { key: "излишки", label: "Ortiqcha" },
  { key: "дефицит", label: "Kamchilik" },
];

const gridTemplate = "40px 1fr 1fr 80px 80px 80px 100px";
const columnLabels = ["№", "Kolleksiya", "Model / O'lcham", "Soni", "Hajmi", "Tekshirilgan", "Narxi"];

export default function ReInventoryReportDetailPage() {
  const { reportId } = useParams();
  const [search] = useQueryState("search", parseAsString);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const { data: totalsData, isLoading: totalsLoading } = useReInventoryTotals({
    reportId: reportId || "",
    type: activeTab,
    enabled: !!reportId,
  });

  const { data, isLoading } = useReInventoryItems({
    reportId: reportId || "",
    queries: {
      type: activeTab,
      search: search || undefined,
      limit: 50,
    },
    enabled: !!reportId,
  });

  const items: ReInventoryItem[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];
  const totals = totalsData as any;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-[4px] mb-[10px]">
        <ReportToolbar />
      </div>

      {/* Totals cards */}
      <div className="flex gap-[4px] mb-[10px]">
        <div className="bg-[#47B13C] rounded-sm px-[16px] py-[10px] min-w-[180px]">
          {totalsLoading ? (
            <Loader className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <span className="text-[18px] font-semibold text-white block">
                {formatPrice(Number(totals?.total || 0))} $
              </span>
              <span className="text-[12px] text-white/80">Umumiy summa</span>
            </>
          )}
        </div>
        <div className="bg-white rounded-sm px-[16px] py-[10px] min-w-[140px]">
          <span className="text-[16px] font-medium text-[#1a1a1a] block">
            {formatPrice(Number(totals?.count || 0))}
          </span>
          <span className="text-[12px] text-[#a3a3a3]">Soni</span>
        </div>
        <div className="bg-white rounded-sm px-[16px] py-[10px] min-w-[140px]">
          <span className="text-[16px] font-medium text-[#1a1a1a] block">
            {formatPrice(Number(totals?.volume || 0))} m²
          </span>
          <span className="text-[12px] text-[#a3a3a3]">Hajmi</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[4px] mb-[10px]">
        {tabs.map((tab) => (
          <button
            key={tab.key || "all"}
            onClick={() => setActiveTab(tab.key)}
            className={`h-[34px] px-[14px] rounded-sm text-[13px] font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#1a1a1a] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
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

      {/* Items list */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="text-[14px] text-[#a3a3a3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          items.map((item, i) => {
            const bc = item.bar_code;
            const collectionTitle = bc?.collection?.title || "—";
            const modelTitle = bc?.model?.title || "";
            const sizeTitle = bc?.size?.title || "";
            const isMetric = bc?.isMetric;

            const count = item.count || 0;
            const y = Number(item.y || 0);
            const checkCount = item.check_count || 0;
            const volume = isMetric ? y : count * (bc?.size?.x || 0) * (bc?.size?.y || 0);
            const comingPrice = Number(item.comingPrice || 0);

            // Determine row color based on surplus/deficit
            const isDifference = isMetric
              ? (y * 100) !== checkCount
              : count !== checkCount;
            const isSurplus = isMetric
              ? checkCount > (y * 100)
              : checkCount > count;

            return (
              <ListRow
                key={item.id || i}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={48}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{collectionTitle}</span>
                <span className="text-[13px] text-[#1a1a1a] truncate">
                  {[modelTitle, sizeTitle].filter(Boolean).join(" / ") || "—"}
                </span>
                <span className="text-[13px] text-[#1a1a1a]">{count}</span>
                <span className="text-[13px] text-[#1a1a1a]">{formatPrice(volume)}</span>
                <span className={`text-[13px] font-medium ${isDifference ? (isSurplus ? "text-[#3ABC49]" : "text-[#EF5C12]") : "text-[#1a1a1a]"}`}>
                  {checkCount}
                </span>
                <span className="text-[13px] text-[#1a1a1a]">{formatPrice(comingPrice)} $</span>
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
