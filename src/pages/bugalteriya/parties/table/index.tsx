import { parseAsInteger, useQueryState } from "nuqs";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ListRow } from "@/components/ui/list-row";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

import ActionPage from "../form";
import Filters from "./filters";
import useDataFetch from "./queries";
import { TData } from "../type";

const GRID = "24px minmax(160px, 1fr) 110px 100px 100px 110px minmax(140px, 1fr) 110px 110px 50px";

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  new: { text: "Ochiq", color: "#1A8A37", bg: "#E5F5E9" },
  pending: { text: "Kutilmoqda", color: "#A66B00", bg: "#FFF4DA" },
  closed: { text: "Kutilmoqda", color: "#A66B00", bg: "#FFF4DA" },
};

function getStatus(status: string) {
  return (
    STATUS_LABEL[status] || {
      text: "Yopildi",
      color: "#7A7A7A",
      bg: "#EEE",
    }
  );
}

export default function Page() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [country] = useQueryState("country");
  const [factory] = useQueryState("factory");
  const [partiyaNumber] = useQueryState("partiya-number");
  const [search] = useQueryState("search");
  const [, setItemName] = useQueryState("itemName");
  const { meUser } = useMeStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDataFetch({
    queries: {
      limit,
      page,
      country: country || undefined,
      partiya_no: partiyaNumber || undefined,
      factory: factory || undefined,
      search: search || undefined,
      warehouse:
        meUser?.position?.role == 7 || meUser?.position?.role == 4
          ? meUser?.filial?.id
          : undefined,
    },
  });

  const flatData: TData[] = data?.pages?.flatMap((p) => p?.items || []) || [];

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onRowClick = (row: TData) => {
    const label = `${row?.factory?.title || ""} ${row?.partiya_no?.title || ""}`.trim() || "Partiya";
    const path = `/parties/${row.id}/info`;
    setItemName(label);
    push(label, path);
    navigate(path);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar (sticky top) */}
      <div className="shrink-0 px-[20px]">
        <Filters />
      </div>

      {/* Column labels */}
      <div
        className="shrink-0 px-[32px] mb-[10px]"
        style={{ display: "grid", gridTemplateColumns: GRID, gap: "8px" }}
      >
        <span className="text-[13px] text-[#A3A3A3]">№</span>
        <span className="text-[13px] text-[#A3A3A3]">Taminotchi</span>
        <span className="text-[13px] text-[#A3A3A3]">Partiya</span>
        <span className="text-[13px] text-[#A3A3A3]">Davlat</span>
        <span className="text-[13px] text-[#A3A3A3]">Hajm</span>
        <span className="text-[13px] text-[#A3A3A3]">Xarajat</span>
        <span className="text-[13px] text-[#A3A3A3]">Sklad</span>
        <span className="text-[13px] text-[#A3A3A3]">Sana</span>
        <span className="text-[13px] text-[#A3A3A3]">Holat</span>
        <span />
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom px-[20px] pb-[20px]">
        <div className="flex flex-col gap-[4px]">
          {isLoading && flatData.length === 0 ? (
            <div className="flex items-center justify-center py-[40px]">
              <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
            </div>
          ) : flatData.length === 0 ? (
            <div className="flex items-center justify-center py-[40px] bg-white rounded-sm">
              <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
            </div>
          ) : (
            <>
              {flatData.map((row, idx) => {
                const st = getStatus(String(row.partiya_status));
                return (
                  <ListRow
                    key={row.id}
                    gridTemplate={GRID}
                    minHeight={64}
                    onClick={() => onRowClick(row)}
                  >
                    <span className="text-[13px] text-[#A3A3A3]">{idx + 1}</span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row.factory?.title ||
                        (row as any).factory?.name ||
                        (row as any).factoryTitle ||
                        "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row.partiya_no?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {(row as any).country?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">
                      {row.volume ? `${row.volume} m²` : "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">
                      {row.expense ? `${row.expense} $` : "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {(row as any).warehouse?.name || "—"}
                    </span>
                    <span className="text-[13px] text-[#1a1a1a]">
                      {row.date ? format(new Date(row.date), "dd.MM.yyyy") : "—"}
                    </span>
                    <span>
                      <span
                        className="text-[12px] font-medium px-[10px] py-[4px] rounded-full"
                        style={{ color: st.color, backgroundColor: st.bg }}
                      >
                        {st.text}
                      </span>
                    </span>
                    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                      <TableAction
                        url={apiRoutes.parties}
                        ShowPreview
                        ShowDelete={meUser?.position.role !== 7}
                        id={row.id}
                      />
                    </div>
                  </ListRow>
                );
              })}
              <div ref={sentinelRef} className="h-[1px]" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-[12px]">
                  <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ActionPage />
    </div>
  );
}
