import { useEffect, useMemo, useRef, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, ChevronDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import ReportToolbar from "@/components/report-toolbar";
import { FilialSelect } from "@/components/filters-ui/filial-select";
import { TabsPill } from "@/components/ui/tabs-pill";
import RefreshRequestButton from "@/components/refresh-request-button";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { getAllData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { minio_img_url } from "@/constants";

import useTransfers from "./queries";
import { TransferData } from "../type";

type Direction = "in" | "out";

const yearsList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const UZ_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

const ACCEPTED_STATUSES = new Set(["Accepted", "Accepted_F"]);

interface TransferGroup {
  groupKey: string; // composite "dateKey__group"
  rawGroup: string; // original transfer.group from backend
  fromId?: string;
  toId?: string;
  date: Date;
  fromTitle: string | null;
  toTitle: string | null;
  transferer: TransferData["transferer"];
  courier: TransferData["courier"];
  items: TransferData[];
  count: number;
  volume: number;
  price: number;
  isConfirmed: boolean;
}

interface DateBucket {
  dateKey: string;
  label: string;
  groups: TransferGroup[];
}

export default function Page() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role;
  const isMM = role === 9;
  const isFM = role === 4 || role === 8; // F-manager / I-manager
  const queryClient = useQueryClient();

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
  const [startDate] = useQueryState("startDate");
  const [endDate] = useQueryState("endDate");

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const [search] = useQueryState("search", parseAsString);
  const [progress, setProgress] = useQueryState("progress", parseAsString);

  // Filial ro'yxati
  const { data: filialsResp } = useQuery({
    queryKey: [apiRoutes.filial, "transfers-filials"],
    queryFn: () => getAllData<any, any>(apiRoutes.filial, { limit: 200, page: 1 }),
  });
  const filials = filialsResp?.items || filialsResp || [];

  // Transferlar
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransfers({
    queries: {
      limit: 50,
      page: 1,
      year,
      search: search || undefined,
      progress: progress ? (progress as any) : undefined,
      startDate: startDate ? (startDate as any) : undefined,
      endDate: endDate ? (endDate as any) : undefined,
      from: isMM ? filialFrom || undefined : direction === "in" ? filialFrom || undefined : meUser?.filial?.id,
      to: isMM ? filialTo || undefined : direction === "in" ? meUser?.filial?.id : filialFrom || undefined,
    },
  });

  const flatData: TransferData[] = data?.pages?.flatMap((p: any) => p?.items || []) || [];

  // 2-darajali guruhlash
  const buckets: DateBucket[] = useMemo(() => {
    const dateMap = new Map<string, DateBucket>();
    const groupMap = new Map<string, TransferGroup>();

    for (const item of flatData) {
      if (!item.date) continue;
      const date = new Date(item.date);
      if (isNaN(date.getTime())) continue;

      const dateKey = format(date, "yyyy-MM-dd");
      const label = `${date.getDate()} ${UZ_MONTHS[date.getMonth()]}`;

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { dateKey, label, groups: [] });
      }
      const bucket = dateMap.get(dateKey)!;

      const rawGroup = item.group || item.id;
      const compositeKey = `${dateKey}__${rawGroup}`;
      let g = groupMap.get(compositeKey);
      if (!g) {
        const fromId = (item as any)?.from?.id;
        const toId = (item as any)?.to?.id;
        const fromFilial = filials.find((f: any) => f.id === fromId);
        const toFilial = filials.find((f: any) => f.id === toId);
        g = {
          groupKey: compositeKey,
          rawGroup,
          fromId,
          toId,
          date,
          transferer: item.transferer,
          courier: item.courier,
          fromTitle: fromFilial?.title || fromFilial?.name || null,
          toTitle: toFilial?.title || toFilial?.name || null,
          items: [],
          count: 0,
          volume: 0,
          price: 0,
          isConfirmed: true,
        };
        groupMap.set(compositeKey, g);
        bucket.groups.push(g);
      }
      g.items.push(item);
      const isMetricItem = (item as any)?.product?.bar_code?.isMetric;
      g.count += isMetricItem ? 1 : Number((item as any).count || 0) || 1;
      g.volume += Number((item as any).kv || 0);
      g.price += Number((item as any)?.product?.priceMeter || 0) * Number((item as any).kv || 0);
      const status = String((item as any).progress || (item as any).progres || "");
      if (!ACCEPTED_STATUSES.has(status)) g.isConfirmed = false;
    }

    return Array.from(dateMap.values())
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .map((b) => ({
        ...b,
        groups: b.groups.sort((a, b) => b.date.getTime() - a.date.getTime()),
      }));
  }, [flatData, filials]);

  const hasActiveFilter = year !== new Date().getFullYear() || !!startDate || !!endDate;
  const isQueryActive = !!search || hasActiveFilter || !!filialFrom || !!filialTo;

  // Search/filter active bo'lsa — barcha guruhlar avtomatik ochiladi.
  // Aks holda — default holatda yopiq turadi, user qo'l bilan ochadi.
  const prevActiveRef = useRef(isQueryActive);
  useEffect(() => {
    if (isQueryActive && !prevActiveRef.current) {
      // Endigina active bo'ldi — barchasini ochib qo'yamiz
      const all = new Set<string>();
      for (const bucket of buckets) for (const g of bucket.groups) all.add(g.groupKey);
      setOpenGroups(all);
    }
    if (!isQueryActive && prevActiveRef.current) {
      // Filter olib tashlandi — default holat (yopiq) ga qaytariladi
      setOpenGroups(new Set());
    }
    prevActiveRef.current = isQueryActive;
  }, [isQueryActive, buckets]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async ({ from, to, group }: { from?: string; to?: string; group: string }) =>
      UpdateData(apiRoutes.transferAccept, "", {
        from,
        to,
        include: [`${group}=group`],
        exclude: [],
      }),
    onSuccess: () => {
      toast.success("Tasdiqlandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.transfers] });
    },
    onError: () => {
      toast.error("Tasdiqlashda xato");
    },
  });

  // Cancel (reject) mutation — bitta transferni bekor qilish
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => UpdateData(apiRoutes.transferReject, "", { ids: [id] }),
    onSuccess: () => {
      toast.success("Bekor qilindi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.transfers] });
    },
    onError: () => {
      toast.error("Bekor qilishda xato");
    },
  });

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

  // F-manager va Kirish tabida — strelka chapga (180deg). Aks holda o'ng.
  const arrowRotate = isFM && (direction || "in") === "in" ? "rotate(180deg)" : "rotate(0deg)";

  // Tasdiqlanmagan grouplar ichidagi gilamlar soni (badge uchun)
  // Metric → 1, donabay → item.count
  const pendingCarpetCount = useMemo(() => {
    let total = 0;
    for (const b of buckets) {
      for (const g of b.groups) {
        if (g.isConfirmed) continue;
        for (const item of g.items as any[]) {
          const isMetric = item?.product?.bar_code?.isMetric;
          total += isMetric ? 1 : Number(item?.count || 0) || 1;
        }
      }
    }
    return total;
  }, [buckets]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0">
        <ReportToolbar
          hasActiveSort={!!progress}
          sortContent={
            <div className="flex flex-col gap-[2px]">
              {[
                { value: null, label: "Barchasi" },
                { value: "accepted", label: "Tasdiqlangan" },
                { value: "pending", label: "Kutilmoqda" },
                { value: "rejected", label: "Rad etilgan" },
              ].map((opt) => {
                const isActive =
                  (opt.value === null && !progress) || progress === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setProgress(opt.value)}
                    className={`relative h-[52px] flex items-center px-[20px] text-left text-[15px] rounded-[6px] transition-colors ${
                      isActive
                        ? "bg-white text-[#1a1a1a]"
                        : "bg-transparent text-[#1a1a1a] hover:bg-white/40"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[10px] bg-[#0078d4]" />
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          }
          hasActiveFilter={hasActiveFilter}
          onClearFilters={() => {
            setYear(new Date().getFullYear());
            const url = new URL(window.location.href);
            url.searchParams.delete("startDate");
            url.searchParams.delete("endDate");
            window.history.replaceState({}, "", url.toString());
          }}
          filterContent={
            <>
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
              <div className="col-span-2 flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
                <DateRangePicker variant="filter" fromPlaceholder="...dan" toPlaceholder="...gacha" />
              </div>
            </>
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

      {/* Tab/Monitoring qatori — F/W. M-manager hide */}
      {!isMM && (
        <div className="shrink-0 pb-[20px] flex items-center gap-[40px]">
          <TabsPill
            tabs={[
              { value: "in", label: "Kiruvchi" },
              { value: "out", label: "Chiquvchi" },
            ]}
            value={direction || "in"}
            onChange={setDirection}
          />
          <RefreshRequestButton
            title="Monitoring"
            subtitle="Filial kesimida"
            icon={<img src="/icons/device-analytics.svg" alt="" className="w-[36px] h-[36px]" />}
          />
          <RefreshRequestButton
            title="Yangi transferlar"
            subtitle="Barcha filiallardan kelgan transferlar"
            badge={pendingCarpetCount}
          />
        </div>
      )}

      {/* Transfer guruhlari */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom pb-[20px]">
        {isLoading && buckets.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
          </div>
        ) : buckets.length === 0 ? (
          <div className="flex items-center justify-center py-[40px] bg-white rounded-[6px]">
            <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {buckets.map((bucket, bIdx) => (
              <div key={bucket.dateKey} className={bIdx === 0 ? "" : "mt-[20px]"}>
                <p className="text-[13px] font-medium text-[#1a1a1a] mb-[10px]">{bucket.label}</p>

                <div className="flex flex-col gap-[5px]">
                  {bucket.groups.map((g) => {
                    const isOpen = openGroups.has(g.groupKey);
                    const arrowColor = g.isConfirmed ? "rgba(26,26,26,0.5)" : "#FF6527";
                    const isAccepting = acceptMutation.isPending && acceptMutation.variables?.group === g.rawGroup;

                    return (
                      <div key={g.groupKey} className="bg-white rounded-[6px] overflow-hidden">
                        {/* Header — 80px, butun qatori click → accordion toggle */}
                        <div
                          onClick={() => toggleGroup(g.groupKey)}
                          className="h-[80px] flex items-center px-[16px] gap-[8px] cursor-pointer hover:bg-[#fafbfc] transition-colors"
                        >
                          {/* Transferer avatar — 40×40 */}
                          <Avatar className="w-[40px] h-[40px] shrink-0">
                            <AvatarImage src={minio_img_url + (g.transferer?.avatar?.path || "")} />
                            <AvatarFallback className="bg-primary text-white text-[14px]">
                              {g.transferer?.firstName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>

                          {/* Direction icon — 24×24, currentColor (inline SVG so color applies) */}
                          <span
                            className="w-[24px] h-[24px] flex items-center justify-center shrink-0 transition-transform"
                            style={{ color: arrowColor, transform: arrowRotate }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 5L21 8M21 8L18 11M21 8H17.603C16.7991 8.00006 16.007 8.19397 15.294 8.56528C14.581 8.9366 13.968 9.47437 13.507 10.133L9.493 15.867C9.03203 16.5256 8.41904 17.0634 7.70601 17.4347C6.99298 17.806 6.20092 17.9999 5.397 18H3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>

                          {/* Courier avatar — 40×40 */}
                          <Avatar className="w-[40px] h-[40px] shrink-0">
                            <AvatarImage src={minio_img_url + (g.courier?.avatar?.path || "")} />
                            <AvatarFallback className="bg-primary text-white text-[14px]">
                              {g.courier?.firstName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>

                          {/* 2-line text — F/W Kiruvchi'da from (kim yuborgan), aks holda to (qayerga ketgan) */}
                          <div className="ml-[8px] flex flex-col">
                            <span className="text-[15px] font-medium text-[#1a1a1a] leading-tight">
                              {(!isMM && (direction || "in") === "in"
                                ? g.fromTitle
                                : g.toTitle) || "—"}
                            </span>
                            <div className="flex items-center gap-[12px] mt-[4px]">
                              <span className="text-[13px] text-[#1a1a1a] opacity-60">
                                Soni: {g.count} ta
                              </span>
                              <span className="text-[13px] text-[#1a1a1a] opacity-60">
                                Hajmi: {g.volume.toFixed(2)} m²
                              </span>
                              <span className="text-[13px] text-[#1a1a1a] opacity-60">
                                Qiymati: {g.price.toFixed(2)} $
                              </span>
                            </div>
                          </div>

                          {/* Time */}
                          <span className="ml-auto text-[13px] font-medium text-[#1a1a1a]">
                            {format(g.date, "HH:mm")}
                          </span>

                          {/* Tasdiqlash button — rounded-full, check icon faqat pending'da */}
                          <button
                            type="button"
                            disabled={g.isConfirmed || isAccepting}
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptMutation.mutate({
                                from: g.fromId,
                                to: g.toId,
                                group: g.rawGroup,
                              });
                            }}
                            className={`ml-[10px] h-[40px] px-[14px] rounded-full flex items-center gap-[6px] text-[13px] font-medium transition-colors bg-white ${
                              g.isConfirmed
                                ? "text-[#1a1a1a]/50 cursor-default"
                                : "text-[#47B13C] hover:bg-[#47B13C]/10"
                            }`}
                          >
                            {isAccepting ? (
                              <Loader className="w-[16px] h-[16px] animate-spin" />
                            ) : (
                              !g.isConfirmed && (
                                <span className="w-[16px] h-[16px] flex items-center justify-center shrink-0 text-[#47B13C]">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.99984 7.33464L7.99984 9.33464L13.3332 4.0013M13.3332 8.0013V12.0013C13.3332 12.3549 13.1927 12.6941 12.9426 12.9441C12.6926 13.1942 12.3535 13.3346 11.9998 13.3346H3.99984C3.64622 13.3346 3.30708 13.1942 3.05703 12.9441C2.80698 12.6941 2.6665 12.3549 2.6665 12.0013V4.0013C2.6665 3.64768 2.80698 3.30854 3.05703 3.05849C3.30708 2.80844 3.64622 2.66797 3.99984 2.66797H9.99984"
                                      stroke="currentColor"
                                      strokeWidth="1.4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              )
                            )}
                            <span>{g.isConfirmed ? "Tasdiqlangan" : "Tasdiqlash"}</span>
                          </button>

                          {/* Chevron — accordion toggle (header click bilan ham ishlaydi) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroup(g.groupKey);
                            }}
                            className="ml-[10px] w-[24px] h-[24px] flex items-center justify-center shrink-0 transition-transform"
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                            aria-label={isOpen ? "Yopish" : "Ochish"}
                          >
                            <ChevronDown className="w-[24px] h-[24px] text-[#1a1a1a]" strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Mahsulotlar ro'yxati */}
                        {isOpen && (
                          <div className="border-t border-[#e7ebf0] px-[24px] py-[4px]">
                            {g.items.map((t, idx) => {
                              const bar = (t as any)?.product?.bar_code;
                              const isMetric = bar?.isMetric;
                              const cnt = Number((t as any).count || 0);
                              const yVal = Number((t as any)?.product?.y || 0);
                              const xVal = Number(bar?.size?.x || 0);
                              const itemVolume = isMetric
                                ? xVal * (cnt / 100)
                                : xVal * cnt * yVal;
                              const imgPath = (t as any)?.product?.main_image?.aws_path;
                              return (
                                <div
                                  key={t.id}
                                  className="h-[68px] grid items-center gap-[12px] border-b border-[#e7ebf0] last:border-b-0"
                                  style={{
                                    gridTemplateColumns:
                                      "24px 44px minmax(100px,1fr) minmax(80px,1fr) 90px 90px 90px 120px 60px 80px 24px",
                                  }}
                                >
                                  <span className="text-[15px] text-[#1a1a1a]">{idx + 1}</span>
                                  <div className="w-[44px] h-[60px] rounded-[4px] bg-[#f5f7f9] overflow-hidden">
                                    {imgPath && (
                                      <img
                                        src={minio_img_url + imgPath}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.collection?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.model?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.size?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.shape?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.style?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a] truncate">
                                    {bar?.color?.title || "—"}
                                  </span>
                                  <span className="text-[15px] text-[#1a1a1a]">{cnt} ta</span>
                                  <span className="text-[15px] text-[#1a1a1a]">
                                    {itemVolume.toFixed(2)} m²
                                  </span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        type="button"
                                        className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f7f9] transition-colors"
                                        aria-label="Aksiya"
                                      >
                                        <MoreHorizontal className="w-[20px] h-[20px]" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-[160px]">
                                      <DropdownMenuItem
                                        className="text-[#e5484d] focus:text-[#e5484d]"
                                        onClick={() => cancelMutation.mutate(t.id)}
                                      >
                                        Bekor qilish
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
