import { useLocation } from "react-router-dom";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { ChevronDown, Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import qs from "qs";

import formatPrice from "@/utils/formatPrice";
import { useYear } from "@/store/year-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IndentIncreaseIcon } from "@/components/icons/indent-increase-icon";
import { ArrowDownGreenIcon } from "@/components/icons/arrow-down-green-icon";
import { ArrowUpRedIcon } from "@/components/icons/arrow-up-red-icon";
import TebleAvatar from "@/components/teble-avatar";
import { apiRoutes } from "@/service/apiRoutes";

import { useBossCashflowList, useBossCashflowTotals, useCashflowTypesForBoss } from "./queries";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

const yearsList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

// User role IDs (backend enum)
const ROLE_M_MANAGER = 9;
const ROLE_ACCOUNTANT = 10;

const ROW_GRID = "110px 80px 130px 120px 1fr";

export default function BossCashflowPage() {
  const location = useLocation();

  const isManager =
    location.pathname.includes("manager-cashflow") &&
    !location.pathname.includes("accountant");
  const role: "manager" | "accountant" = isManager ? "manager" : "accountant";
  const createdByRole = isManager ? ROLE_M_MANAGER : ROLE_ACCOUNTANT;

  const [month, setMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(new Date().getMonth() + 1)
  );
  const [cashflowSlug, setCashflowSlug] = useQueryState("cashflowSlug", parseAsString);
  const [flow, setFlow] = useQueryState("flow", parseAsString);
  const { year, setYear } = useYear();

  // Cashflow types — Tip dropdown
  const { data: cfTypes } = useCashflowTypesForBoss();
  const cfTypesList = (cfTypes as any[])?.filter(Boolean) || [];

  // Cashflow list — month/year reportga tegishli, M-manager/Accountant role bo'yicha
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBossCashflowList({
      createdByRole,
      reportMonth: month,
      reportYear: year,
      type: flow === "income" ? "income" : flow === "expense" ? "expense" : undefined,
      cashflowSlug: cashflowSlug || undefined,
    });

  const items = data?.pages?.flatMap((p) => p?.items || []) || [];

  // Saldo va kirim/chiqim totallari — filterga ta'sir etmaydigan, faqat
  // role + reportMonth + reportYear bo'yicha
  const { data: totalsData } = useBossCashflowTotals({
    createdByRole,
    reportMonth: month,
    reportYear: year,
  });
  const baseTotals = totalsData?.totals;
  const totalIncome = Number(baseTotals?.totalIncome || 0);
  const totalExpense = Number(baseTotals?.totalExpense || 0);
  const saldo = totalIncome - totalExpense;

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, role]);

  // Excel export
  const exportExcel = () => {
    const query: Record<string, string | number | undefined> = {
      createdByRole,
      reportMonth: month,
      reportYear: year,
      type: flow === "income" ? "income" : flow === "expense" ? "expense" : undefined,
      cashflowSlug: cashflowSlug || undefined,
    };
    const params = `?${qs.stringify(query, { skipNulls: true })}`;
    window.location.href =
      import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
  };

  const tipLabel =
    cfTypesList.find((t: any) => t.slug === cashflowSlug)?.title || "Barchasi";

  const toggleFlow = (val: "income" | "expense") => {
    setFlow(flow === val ? null : val);
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f7f9]">
      {/* Fixed top: filter + saldo + labels */}
      <div className="shrink-0">
        {/* Filter row */}
        <div className="flex items-center gap-[8px] mb-[20px]">
          {/* Tip — cashflow types */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-[4px] h-[34px] px-[12px] bg-[#f5f7f9] border border-[#dfe6ed] rounded-[4px]">
                <IndentIncreaseIcon className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-medium text-[#1a1a1a]">Turi</span>
                <span className="text-[13px] font-medium text-[#1a1a1a] ml-[8px]">{tipLabel}</span>
                <ChevronDown className="w-[12px] h-[12px] text-[#1a1a1a] ml-[4px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-[4px] max-h-[320px] overflow-auto" align="start">
              <button
                onClick={() => setCashflowSlug(null)}
                className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
                  !cashflowSlug ? "bg-[#f5f7f9] font-medium" : ""
                }`}
              >
                Barchasi
              </button>
              <div className="h-[1px] bg-[#e8eef3] my-[4px]" />
              {cfTypesList.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setCashflowSlug(t.slug)}
                  className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
                    cashflowSlug === t.slug ? "bg-[#f5f7f9] font-medium" : ""
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Davr */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-[4px] h-[34px] px-[12px] bg-[#f5f7f9] border border-[#dfe6ed] rounded-[4px]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path
                    d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z M12 1.5V4.5 M6 1.5V4.5 M2.25 7.5H15.75"
                    stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-medium text-[#1a1a1a]">Davr</span>
                <span className="text-[13px] font-medium text-[#1a1a1a] ml-[8px]">{MONTHS[(month || 1) - 1]}</span>
                <ChevronDown className="w-[12px] h-[12px] text-[#1a1a1a] ml-[4px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-[8px]" align="start">
              <div className="flex gap-[4px] mb-[6px] flex-wrap">
                {yearsList.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-[10px] h-[28px] text-[12px] rounded-[4px] ${
                      year === y ? "bg-[#1a1a1a] text-white" : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-[4px]">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setMonth(i + 1)}
                    className={`h-[30px] text-[12px] rounded-[4px] ${
                      month === i + 1 ? "bg-[#0078d4] text-white" : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Excel */}
          <button
            onClick={exportExcel}
            className="h-[34px] w-[34px] flex items-center justify-center bg-[#f5f7f9] rounded-[4px] hover:opacity-70 transition shrink-0"
            title="Excel export"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_xls_boss)">
                <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A" />
              </g>
              <defs><clipPath id="clip_xls_boss"><rect width="18" height="18" fill="white" /></clipPath></defs>
            </svg>
          </button>
        </div>

        {/* Saldo card — col-span-5 of 11-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-x-[20px] mb-[28px]">
          <div className="lg:col-span-5 bg-white h-[62px] rounded-[8px] flex items-center justify-between px-[24px]">
            <div className="flex items-baseline gap-[12px]">
              <span className="text-[13px] text-[#1a1a1a]">Saldo:</span>
              <span className="text-[17px] text-[#1a1a1a]">
                {!totalsData ? "—" : `${formatPrice(saldo)} $`}
              </span>
            </div>
            <div className="flex items-center gap-[12px]">
              <button
                onClick={() => toggleFlow("income")}
                className={`flex items-center gap-[4px] px-[8px] h-[30px] rounded-[4px] transition ${
                  flow === "income" ? "bg-[#3ABC49]/10" : "hover:bg-[#f5f7f9]"
                }`}
                title="Faqat kirim"
              >
                <ArrowDownGreenIcon className="w-[18px] h-[18px]" />
                <span className="text-[15px] text-[#1a1a1a]">
                  {!totalsData ? "—" : `$${formatPrice(totalIncome)}`}
                </span>
              </button>
              <button
                onClick={() => toggleFlow("expense")}
                className={`flex items-center gap-[4px] px-[8px] h-[30px] rounded-[4px] transition ${
                  flow === "expense" ? "bg-[#FF553E]/10" : "hover:bg-[#f5f7f9]"
                }`}
                title="Faqat chiqim"
              >
                <ArrowUpRedIcon className="w-[18px] h-[18px]" />
                <span className="text-[15px] text-[#1a1a1a]">
                  {!totalsData ? "—" : `$${formatPrice(totalExpense)}`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Column labels — fixed */}
        <div
          className="px-[26px]"
          style={{ display: "grid", gridTemplateColumns: ROW_GRID, gap: "8px" }}
        >
          <span className="text-[13px] text-[#a3a3a3] text-right">Summa</span>
          <span className="text-[13px] text-[#a3a3a3] text-center">Status</span>
          <span className="text-[13px] text-[#a3a3a3]">Turi</span>
          <span className="text-[13px] text-[#a3a3a3]">Sana</span>
          <span className="text-[13px] text-[#a3a3a3]">Malumotlar</span>
        </div>
      </div>

      {/* Scrollable list — labeldan 10px past */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom mt-[10px]">
        <div className="flex flex-col gap-[4px] pb-[40px]">
          {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center py-[40px]">
              <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center py-[40px] bg-white rounded-[6px]">
              <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
            </div>
          ) : (
            <>
              {items.map((item: any, i: number) => (
                <BossCashflowRow key={item?.id || i} item={item} />
              ))}
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
    </div>
  );
}

/* ── Cashflow row (figma px-perfect) ── */
function BossCashflowRow({ item }: { item: any }) {
  const isIncome = item.type === "income";
  const price = Number(item.price || 0);
  const sign = isIncome ? "+" : "-";
  const amountColor = isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]";

  const typeName = item.cashflow_type?.title || "—";
  const typeDotColor = isIncome ? "#3ABC49" : "#EF5C12";

  const dateStr = item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—";
  const description = item.comment || "";

  const userName = item.createdBy?.firstName || "?";
  const userAvatar = item.createdBy?.avatar?.path;

  return (
    <div
      className="bg-white h-[72px] rounded-[6px] px-[26px] items-center"
      style={{ display: "grid", gridTemplateColumns: ROW_GRID, gap: "8px" }}
    >
      <span className={`text-[15px] font-medium opacity-90 ${amountColor} text-right`}>
        {sign} {formatPrice(price)}
      </span>
      <div className="flex items-center justify-center">
        <TebleAvatar size={42} name={userName} url={userAvatar} status="success" />
      </div>
      <div className="flex items-center gap-[5px]">
        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeDotColor }} />
        <span className="text-[13px] text-[#1a1a1a]">{typeName}</span>
      </div>
      <span className="text-[13px] text-[#1a1a1a]">{dateStr}</span>
      <span className="text-[13px] text-[#999] truncate">{description}</span>
    </div>
  );
}
