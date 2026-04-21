import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { X, Loader } from "lucide-react";
import qs from "qs";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { apiRoutes } from "@/service/apiRoutes";
import { getByIdData, getAllData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { useMeStore } from "@/store/me-store";
import useData from "@/pages/employees/table/queries";
import debounce from "@/utils/debounce";
import type { CashflowType } from "@/components/adding-parish-flow";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "terminal",
  discount: "discount",
  navar: "markup",
  debt: "debt",
};
const typeFilter: Record<string, string> = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};

import { CashflowRow, cashflowGridTemplate, cashflowLabels } from "@/components/cashflow-row";

export default function DashboardKassaDetail() {
  const params = useParams();
  const id = params.id || params.kassaId;
  const { meUser } = useMeStore();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sellerId, setSellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId, setCashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);

  const [showSearch, setShowSearch] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: kassaData } = useQuery({
    queryKey: [apiRoutes.kassa, id],
    queryFn: () =>
      getByIdData<TKassareportData, object>(apiRoutes.kassa, id || ""),
    enabled: Boolean(id),
  });

  // Sellers
  const { data: sellersData } = useData({
    queries: {
      limit: 100,
      page: 1,
      filial: meUser?.filial?.id,
    },
  });
  const sellers = sellersData?.pages?.[0]?.items || [];

  // Cashflow types
  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager", "kassa-detail"],
    queryFn: () => getAllData("/cashflow-types/for/branch-manager"),
  });
  const cashflowTypes = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) => ct.slug !== "balance"
  ) || [];

  // Excel export
  const { mutate: exportExcel, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query: Record<string, string | undefined> = { kassaId: id || undefined };
      if (search) query.search = search;
      if (sellerId) query.sellerId = sellerId;
      if (cashflowTypeId) query.cashflowTypeId = cashflowTypeId;
      if (startDate) query.fromDate = startDate;
      if (endDate) query.toDate = endDate;
      const params = `?${qs.stringify(query, { arrayFormat: "repeat" })}`;
      const url = import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Export xatolik: ${response.status}`);
      const blob = await response.blob();
      if (blob.type?.includes("text/html")) throw new Error("Server xato javob qaytardi");
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cashflows.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
  });

  const cashflowStatus =
    sort === "all" ? undefined : sort === "pending" ? "pending" : "accepted";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: id || "",
        limit: 10,
        page: 1,
        tip: tipFilter[tip as string],
        type:
          sortSingle === "Все"
            ? typeFilter[tip as string]
            : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip === "collection" ? "cash_collection" : undefined,
        status: cashflowStatus,
        search: search || undefined,
        sellerId: sellerId || undefined,
        cashflowTypeId: cashflowTypeId || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
      },
      enabled: Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const cashflowTotals = (data?.pages?.[0] as any)?.totals;
  const hasActiveFilter = !!cashflowTypeId || !!sellerId || !!search || !!startDate || !!endDate;

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // ReportTotals uchun data tayyorlash
  const reportTotalsData = useMemo(() => {
    if (!kassaData) return undefined;
    return {
      ...kassaData,
      totalIncome: kassaData?.income ?? 0,
      totalExpense: kassaData?.expense ?? 0,
      totalSale: kassaData?.sale ?? 0,
      totalPlasticSum: kassaData?.plasticSum ?? 0,
      totalCashCollection: kassaData?.cash_collection ?? 0,
      totalDiscount: kassaData?.discount ?? 0,
      totalSaleReturn: kassaData?.return_sale ?? 0,
      managerSum: kassaData?.in_hand ?? 0,
      managerSaldo: kassaData?.opening_balance ?? 0,
    } as TKassareportData;
  }, [kassaData]);

  const filteredTotals = hasActiveFilter ? {
    totalPrice: cashflowTotals?.totalPrice || 0,
    totalDebtSum: cashflowTotals?.totalDebtSum || 0,
    plasticSum: cashflowTotals?.plasticSum || 0,
    totalReturnSale: cashflowTotals?.totalReturnSale || 0,
    totalCashCollection: cashflowTotals?.totalCashCollection || 0,
    kv: cashflowTotals?.kv || 0,
    totalAdditionalProfit: cashflowTotals?.totalAdditionalProfit || 0,
    totalDiscount: cashflowTotals?.totalDiscount || 0,
    totalIncome: cashflowTotals?.totalIncome || 0,
    totalExpense: cashflowTotals?.totalExpense || 0,
  } : undefined;

  const clearFilters = () => {
    setSellerId(null);
    setCashflowTypeId(null);
    setStartDate(null);
    setEndDate(null);
    setFilterOpen(false);
  };

  const handleCardClick = (filterValue: string) => {
    setTip(tip === filterValue ? null : filterValue);
  };

  const handleIncomeClick = () => {
    setTip(tip === "income" ? null : "income");
  };

  const handleExpenseClick = () => {
    setTip(tip === "expense" ? null : "expense");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar: search, sort, filter, excel */}
      <div className="flex items-center gap-[4px] shrink-0 mb-[10px]">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-[4px] bg-white rounded-sm px-[10px] h-[42px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Input
              autoFocus
              defaultValue={search || ""}
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value || null);
              }, 500)}
              className="bg-transparent border-none h-[32px] w-[200px] p-0 text-[14px] shadow-none"
              placeholder="Qidirish..."
            />
            <X
              className="w-[16px] h-[16px] cursor-pointer text-[#A3A3A3] hover:text-[#1A1A1A]"
              onClick={() => {
                setSearch(null);
                setShowSearch(false);
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Sort */}
        <button className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask_sort_kd" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
              <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </mask>
            <g mask="url(#mask_sort_kd)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4"/>
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A"/>
            </g>
          </svg>
        </button>

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button
              className={`w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors ${hasActiveFilter ? "ring-2 ring-[#0078D4]" : ""}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke={hasActiveFilter ? "#0078D4" : "#1A1A1A"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] p-4">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sotuvchi</p>
                <FilterSelect
                  name="sellerId"
                  placeholder="Sotuvchi tanlang"
                  className="w-full"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...sellers.map((s: any) => ({
                      label: `${s.firstName} ${s.lastName}`,
                      value: s.id,
                    })),
                  ]}
                />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
                <FilterSelect
                  name="cashflowTypeId"
                  placeholder="Turni tanlang"
                  className="w-full"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...cashflowTypes.map((ct) => ({
                      label: ct.title,
                      value: ct.id,
                    })),
                  ]}
                />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sana oralig'i</p>
                <DateRangePicker
                  fromPlaceholder="Dan"
                  toPlaceholder="Gacha"
                  className="max-w-full"
                />
              </div>
              {hasActiveFilter && (
                <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
                  Tozalash
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Excel */}
        <button
          onClick={() => exportExcel()}
          disabled={excelPending}
          className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {excelPending ? (
            <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_excel_kd)">
                <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A"/>
              </g>
              <defs>
                <clipPath id="clip_excel_kd"><rect width="18" height="18" fill="white"/></clipPath>
              </defs>
            </svg>
          )}
        </button>
      </div>

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        filteredTotals={filteredTotals}
        hasActiveFilter={hasActiveFilter}
        onCardClick={handleCardClick}
        onIncomeClick={handleIncomeClick}
        onExpenseClick={handleExpenseClick}
        onGreenCardClick={() => setTip(null)}
      />

      {/* Labellar */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: cashflowGridTemplate, gap: "16px" }}
      >
        {cashflowLabels.map((label: any, i: any) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${label.center ? "text-center" : ""} ${(label as any).right ? "text-right" : ""}`}>{label.text}</span>
        ))}
      </div>

      {/* Cashflow listlar */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading && flatData.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
          </div>
        ) : flatData.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          <>
            {flatData.map((item: any, i: number) => (
              <CashflowRow key={item?.id || i} item={item} />
            ))}
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-[10px]">
                <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

