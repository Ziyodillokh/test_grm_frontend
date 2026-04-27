import { useEffect, useMemo, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, RefreshCcw } from "lucide-react";

import ReportToolbar from "@/components/report-toolbar";
import { FilialSelect } from "@/components/filters-ui/filial-select";
import { TabsPill } from "@/components/ui/tabs-pill";
import RefreshRequestButton from "@/components/refresh-request-button";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import useTransfers from "./queries";
import { TransferData } from "../type";

type Direction = "in" | "out";

const yearsList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

interface GroupedTransfer {
  group: string;
  date: string;
  transferer: TransferData["transferer"];
  courier: TransferData["courier"];
  fromTitle: string | null;
  toTitle: string | null;
  items: TransferData[];
}

export default function Page() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role;
  const isMM = role === 9;

  const { year, setYear } = useYear();

  const [filialFrom, setFilialFrom] = useQueryState("filialFrom", parseAsString);
  const [filialTo, setFilialTo] = useQueryState("filialTo", parseAsString);
  const [direction, setDirection] = useQueryState<Direction>(
    "direction",
    {
      parse: (v: string) => (v === "out" ? "out" : "in"),
      serialize: (v: Direction) => v,
    }
  );

  // Filial ro'yxati — selektorlarda disable qilish va guruh title'lari uchun
  const { data: filialsResp } = useQuery({
    queryKey: [apiRoutes.filial, "transfers-filials"],
    queryFn: () => getAllData<any, any>(apiRoutes.filial, { limit: 200, page: 1 }),
  });
  const filials = filialsResp?.items || filialsResp || [];

  // Transferlarni shu yilga qarab olish
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransfers({
    queries: {
      limit: 50,
      page: 1,
      year,
      from: isMM ? filialFrom || undefined : direction === "in" ? filialFrom || undefined : meUser?.filial?.id,
      to: isMM ? filialTo || undefined : direction === "in" ? meUser?.filial?.id : filialFrom || undefined,
    },
  });

  const flatData: TransferData[] = data?.pages?.flatMap((p: any) => p?.items || []) || [];

  // Sanasiga qarab guruhlash — eng oxirgi yuqorida
  const groups: GroupedTransfer[] = useMemo(() => {
    const map = new Map<string, GroupedTransfer>();
    for (const item of flatData) {
      const key = item.group || (item.date ? String(item.date) : item.id);
      if (!map.has(key)) {
        const fromId = (item as any)?.from?.id;
        const toId = (item as any)?.to?.id;
        const fromFilial = filials.find((f: any) => f.id === fromId);
        const toFilial = filials.find((f: any) => f.id === toId);
        map.set(key, {
          group: key,
          date: item.date ? String(item.date) : key,
          transferer: item.transferer,
          courier: item.courier,
          fromTitle: fromFilial?.title || fromFilial?.name || null,
          toTitle: toFilial?.title || toFilial?.name || null,
          items: [],
        });
      }
      map.get(key)!.items.push(item);
    }
    return Array.from(map.values()).sort((a, b) => {
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      return db - da;
    });
  }, [flatData, filials]);

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

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={year !== new Date().getFullYear()}
          onClearFilters={() => setYear(new Date().getFullYear())}
          filterContent={
            <div className="col-span-2">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px] mb-[6px]">Yil</p>
              <div className="flex gap-[8px] flex-wrap">
                {yearsList.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    className={`h-[36px] px-[14px] rounded-[6px] text-[13px] font-medium transition-colors ${
                      year === y
                        ? "bg-[#0078d4] text-white"
                        : "bg-white text-[#1a1a1a] border border-[#e7ebf0] hover:bg-[#f5f7f9]"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          }
          inlineControls={
            <>
              <FilialSelect
                placeholder="...dan"
                value={filialFrom}
                onChange={setFilialFrom}
                filials={filials}
                disabledIds={filialTo ? [filialTo] : []}
                showAllOption
                icon={<img src="/icons/arrow-bar-to-left.svg" alt="" className="w-[16px] h-[16px]" />}
              />
              {isMM && (
                <FilialSelect
                  placeholder="...ga"
                  value={filialTo}
                  onChange={setFilialTo}
                  filials={filials}
                  disabledIds={filialFrom ? [filialFrom] : []}
                  showAllOption
                  icon={<img src="/icons/arrow-bar-to-left.svg" alt="" className="w-[16px] h-[16px]" />}
                />
              )}
            </>
          }
        />
      </div>

      {/* Tab/Monitoring qatori */}
      <div className="shrink-0 pb-[20px] flex items-center gap-[40px]">
        {!isMM && (
          <TabsPill
            tabs={[
              { value: "in", label: "Kiruvchi" },
              { value: "out", label: "Chiquvchi" },
            ]}
            value={direction || "in"}
            onChange={setDirection}
          />
        )}
        <RefreshRequestButton
          title="Monitoring"
          subtitle="Filial kesimida"
          icon={<img src="/icons/device-analytics.svg" alt="" className="w-[36px] h-[36px]" />}
        />
        <RefreshRequestButton />
      </div>

      {/* Transfer guruhlari */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom pb-[20px]">
        {isLoading && groups.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center py-[40px] bg-white rounded-sm">
            <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {groups.map((g) => (
              <div key={g.group} className="bg-white rounded-[6px] overflow-hidden">
                {/* Guruh header */}
                <div className="flex items-center gap-[12px] px-[16px] py-[12px] bg-[#f5f7f9] border-b border-[#e7ebf0]">
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {g.fromTitle || "—"}
                  </span>
                  <RefreshCcw className="w-[14px] h-[14px] text-[#1a1a1a] opacity-60" />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {g.toTitle || "—"}
                  </span>
                  <span className="text-[13px] text-[#1a1a1a] opacity-60 ml-[16px]">
                    {g.items.length} ta
                  </span>
                  <span className="text-[13px] text-[#1a1a1a] opacity-60 ml-auto">
                    {g.date ? format(new Date(g.date), "dd.MM.yyyy HH:mm") : ""}
                  </span>
                </div>
                {/* Transferlar ro'yxati */}
                <div className="flex flex-col">
                  {g.items.map((t, idx) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-[12px] px-[16px] py-[10px] border-b border-[#f5f7f9] last:border-b-0"
                    >
                      <span className="text-[13px] text-[#A3A3A3] w-[24px]">{idx + 1}</span>
                      <span className="text-[14px] text-[#1a1a1a] flex-1 truncate">
                        {(t as any)?.product?.bar_code?.collection?.title || "—"}
                      </span>
                      <span className="text-[14px] text-[#1a1a1a]">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={sentinelRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-[12px]">
                <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
