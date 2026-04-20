import { useRef } from "react";
import { ListRow } from "@/components/ui/list-row";
import { Loader } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useMeStore } from "@/store/me-store";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";

import PriceFilter from "./filter";
import useDataFetch from "./queries";

const gridTemplate = "1fr 90px 120px 120px 70px";
const columnLabels = ["Kolleksiya", "Hajm", "Tannarx", "Sotuv narxi", ""];

export default function Page() {
  const me = useMeStore();
  const [search] = useQueryState("search", parseAsString);
  const [editId, setEditId] = useQueryState("editId", parseAsString);
  const pendingRef = useRef<{ id: string; priceMeter: number } | null>(null);

  const { data, isLoading, refetch } = useDataFetch({
    queries: {
      limit: 100,
      page: 1,
      search: search || undefined,
    },
    filialId: me.meUser?.filial?.id,
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];

  const handleSave = async (collectionId: string) => {
    if (pendingRef.current && pendingRef.current.id === collectionId) {
      await api.post(apiRoutes.collectionMultiple, [
        { priceMeter: pendingRef.current.priceMeter, collectionId },
      ]);
      pendingRef.current = null;
      refetch();
    }
    setEditId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PriceFilter />

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
          items.map((item: any, i: number) => {
            const isEditing = editId === item.id;
            const prices = item.collection_prices?.[0];

            return (
              <ListRow
                key={item.id || i}
                gridTemplate={gridTemplate}
                className="pl-[20px]"
                minHeight={60}
              >
                <span className="text-[13px] font-medium text-[#1a1a1a]">{item.title}</span>
                <span className="text-[13px] text-[#1a1a1a]">
                  {(item.totalKv || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
                </span>

                {/* Tannarx — faqat o'qish */}
                <span className="text-[13px] text-[#1a1a1a]">
                  {(prices?.comingPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
                </span>

                {/* Sotuv narxi — faqat Saqlash bosilganda jo'natiladi */}
                <div className="relative">
                  <Input
                    disabled={!isEditing}
                    className="h-[32px] text-[13px] pr-[20px] border-border bg-card rounded-[6px]"
                    defaultValue={prices?.priceMeter}
                    placeholder="0"
                    type="number"
                    onChange={(e) => {
                      pendingRef.current = { id: item.id, priceMeter: Number(e.target.value) };
                    }}
                  />
                  <span className="absolute right-2 top-[8px] text-[11px] text-[#a3a3a3]">$</span>
                </div>

                {/* Tahrir / Saqlash */}
                <button
                  onClick={() => isEditing ? handleSave(item.id) : setEditId(item.id)}
                  className={`h-[32px] px-[10px] rounded-[6px] text-[12px] ${
                    isEditing
                      ? "bg-[#0078D4] text-white"
                      : "bg-[#F5F5F5] text-[#1a1a1a]"
                  }`}
                >
                  {isEditing ? "Saqlash" : "Tahrir"}
                </button>
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
