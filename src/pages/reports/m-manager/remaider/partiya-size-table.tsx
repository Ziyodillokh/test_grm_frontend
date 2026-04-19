import { ListRow } from "@/components/ui/list-row";
import { Loader } from "lucide-react";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useFilialSnapshot } from "./queries";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";

const gridTemplate = "1fr 80px 120px 120px 100px";
const columnLabels = ["O'lcham", "Soni", "Hajm", "Summa", "Foyda"];

export default function PartiyaSizeTable() {
  const { meUser } = useMeStore();
  const { partiyaId, collectionId, modelId } = useParams();
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const [filialId] = useQueryState("filialId", parseAsString.withDefault(""));
  const [search] = useQueryState("search", parseAsString);

  const role = meUser?.position?.role ?? 0;
  const resolvedFilialId = role >= 9 ? (filialId || undefined) : meUser?.filial?.id;

  const { data, isLoading } =
    useFilialSnapshot({
      queries: {
        filialId: resolvedFilialId,
        date: date || undefined,
        search: search || undefined,
        groupBy: "size",
        partiyaId,
        collectionId,
        modelId,
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.meta?.totals;

  return (
    <div className="flex flex-col h-full">
      <Filter
        totalCount={totals?.totalCount || 0}
        totalKv={totals?.totalKv || 0}
        totalSum={totals?.totalSum || 0}
        totalProfit={totals?.totalProfit || 0}
      />

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[20px]"
              minHeight={60}
            >
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.title?.split("x").map((v: string) => Math.round(parseFloat(v) * 100)).join("x")}</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.count || 0).toLocaleString()} ta</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.kv || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</span>
              <span className="text-[13px] text-[#1a1a1a]">{(item.sum || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</span>
              <span className="text-[13px] text-[#47B13C]">+{(item.profit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
