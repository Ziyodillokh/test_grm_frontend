import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListRow } from "@/components/ui/list-row";
import { parseAsString, useQueryState } from "nuqs";
import { X, Loader, MoreVertical, Plus } from "lucide-react";
import qs from "qs";
import { toast } from "sonner";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { useOpenKassa } from "@/pages/report/table/queries";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData, AddData, PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { useMeStore } from "@/store/me-store";
import useData from "@/pages/employees/table/queries";
import debounce from "@/utils/debounce";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import { Spinner } from "@/components/ui/spinner";
import type { CashflowType } from "@/components/adding-parish-flow";
import type { TransactionItem } from "@/pages/cashier/report/type";

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

const cashflowGridTemplate = "60px 60px 120px 120px 1fr 70px";
const cashflowLabels = [
  { text: "Summa", right: true },
  { text: "Status", center: true },
  { text: "Turi" },
  { text: "Sana" },
  { text: "Malumotlar" },
  { text: "" },
];

export default function FManagerCurrent() {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState("sortSingle", parseAsString.withDefault("Все"));
  const [id] = useQueryState("id");
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sellerId, setSellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId, setCashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);

  const [showSearch, setShowSearch] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"parish" | "flow">("parish");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");

  // F-Manager o'z kassasi
  const { data: reportData } = useOpenKassa({
    id: meUser?.filial?.id,
  });

  const kassaId = reportData?.id || id || "";

  // Sellers
  const { data: sellersData } = useData({
    queries: { limit: 100, page: 1, filial: meUser?.filial?.id },
  });
  const sellers = sellersData?.pages?.[0]?.items || [];

  // Cashflow types — toolbar filter + dialog uchun
  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager", "f-current"],
    queryFn: () => getAllData("/cashflow-types/for/branch-manager"),
  });
  const cashflowTypes = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) => ct.slug !== "balance"
  ) || [];

  // Kirim/Chiqim qo'shish
  const { mutate: addCashflow, isPending: addPending } = useMutation({
    mutationFn: (data: any) => AddData(apiRoutes.cashflow, data),
    onSuccess: () => {
      toast.success(dialogType === "parish" ? "Kirim muvaffaqiyatli qo'shildi" : "Chiqim muvaffaqiyatli qo'shildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
      setDialogOpen(false);
    },
  });

  const openDialog = (type: "parish" | "flow") => {
    setDialogType(type);
    setSelectedCategory("");
    setAmount("");
    setComment("");
    setDate("");
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedCategory) { toast.error("Turni tanlang"); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error("Summani kiriting"); return; }
    addCashflow({
      price: parseFloat(amount),
      type: dialogType === "parish" ? "Приход" : "Расход",
      comment,
      ...(date ? { date } : {}),
      createdBy: meUser?.id,
      kassa: reportData?.id,
      cashflow_type: selectedCategory,
      tip: "cashflow",
    });
  };

  const categories = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) =>
      (ct.type === (dialogType === "parish" ? "income" : "out") || ct.type === "both") &&
      ct.slug !== "balance"
  );

  // Excel export
  const { mutate: exportExcel, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query: Record<string, string | undefined> = { kassaId: kassaId || undefined };
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
        kassaId,
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
      enabled: !!kassaId,
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const cashflowTotals = (data?.pages?.[0] as any)?.totals;
  const hasActiveFilter = !!cashflowTypeId || !!sellerId || !!search || !!startDate || !!endDate;

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
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

  // ReportTotals data
  const reportTotalsData = useMemo(() => {
    if (!reportData) return undefined;
    return {
      ...reportData,
      totalIncome: reportData?.income ?? 0,
      totalExpense: reportData?.expense ?? 0,
      totalSale: reportData?.sale ?? 0,
      totalPlasticSum: reportData?.plasticSum ?? 0,
      totalCashCollection: reportData?.cash_collection ?? 0,
      totalDiscount: reportData?.discount ?? 0,
      totalSaleReturn: reportData?.return_sale ?? 0,
      managerSum: reportData?.in_hand ?? 0,
      managerSaldo: reportData?.opening_balance ?? 0,
    } as unknown as TKassareportData;
  }, [reportData]);

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

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-[4px] shrink-0 mb-[10px]">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-[4px] bg-white rounded-[8px] px-[10px] h-[42px]">
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
            <X className="w-[16px] h-[16px] cursor-pointer text-[#A3A3A3] hover:text-[#1A1A1A]" onClick={() => { setSearch(null); setShowSearch(false); }} />
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Sort */}
        <button className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask_sort_fm" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
              <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </mask>
            <g mask="url(#mask_sort_fm)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4"/>
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A"/>
            </g>
          </svg>
        </button>

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button className={`w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors ${hasActiveFilter ? "ring-2 ring-[#0078D4]" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke={hasActiveFilter ? "#0078D4" : "#1A1A1A"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] p-4">
            <SheetHeader><SheetTitle>Filter</SheetTitle></SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sotuvchi</p>
                <FilterSelect name="sellerId" placeholder="Sotuvchi tanlang" className="w-full" options={[{ label: "Barchasi", value: "clear" }, ...sellers.map((s: any) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id }))]} />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
                <FilterSelect name="cashflowTypeId" placeholder="Turni tanlang" className="w-full" options={[{ label: "Barchasi", value: "clear" }, ...cashflowTypes.map((ct) => ({ label: ct.title, value: ct.id }))]} />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Sana oralig'i</p>
                <DateRangePicker fromPlaceholder="Dan" toPlaceholder="Gacha" className="max-w-full" />
              </div>
              {hasActiveFilter && (
                <Button variant="outline" onClick={clearFilters} className="w-full mt-2">Tozalash</Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Excel */}
        <button onClick={() => exportExcel()} disabled={excelPending} className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50">
          {excelPending ? (
            <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_excel_fm)">
                <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A"/>
              </g>
              <defs><clipPath id="clip_excel_fm"><rect width="18" height="18" fill="white"/></clipPath></defs>
            </svg>
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Kirim qo'shish */}
        <Button onClick={() => openDialog("parish")} className="h-[42px] bg-[#47B13C] hover:bg-[#3da032] text-white rounded-[8px] px-[16px] text-[13px] font-medium">
          <Plus className="w-[16px] h-[16px] mr-[4px]" />
          Kirim
        </Button>

        {/* Chiqim qo'shish */}
        <Button onClick={() => openDialog("flow")} className="h-[42px] bg-[#EF5C12] hover:bg-[#d4500f] text-white rounded-[8px] px-[16px] text-[13px] font-medium">
          <Plus className="w-[16px] h-[16px] mr-[4px]" />
          Chiqim
        </Button>
      </div>

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        filteredTotals={filteredTotals}
        hasActiveFilter={hasActiveFilter}
        onCardClick={handleCardClick}
        onIncomeClick={() => setTip(tip === "income" ? null : "income")}
        onExpenseClick={() => setTip(tip === "expense" ? null : "expense")}
        onGreenCardClick={() => setTip(null)}
      />

      {/* Labellar */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: cashflowGridTemplate, gap: "16px" }}
      >
        {cashflowLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${(label as any).center ? "text-center" : ""} ${(label as any).right ? "text-right" : ""}`}>{label.text}</span>
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
            <div ref={loadMoreRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-[10px]">
                <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-[10px]">
          <div className={`p-1 h-[30px] pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[35px] ${dialogType === "parish" ? "bg-[#47B13C]" : "bg-[#EF5C12]"} text-white`}>
            {dialogType === "parish" ? "Kirim qo'shish" : "Chiqim qo'shish"}
          </div>
          <div className="flex gap-1">
            <div className="flex w-full max-w-[210px] items-start justify-start flex-wrap gap-1">
              {!categories ? (
                <div className="w-full flex justify-center items-center h-[181px]"><Spinner /></div>
              ) : (
                categories?.map((ct) => (
                  <div
                    key={ct.id}
                    onClick={() => setSelectedCategory(ct.id)}
                    className={`w-[calc(50%-2px)] h-22 bg-input flex items-center justify-center flex-col rounded-[7px] text-center cursor-pointer ${
                      selectedCategory === ct.id ? (dialogType === "parish" ? "ring-2 ring-[#47B13C]" : "ring-2 ring-[#EF5C12]") : ""
                    }`}
                  >
                    <p className="text-primary text-[13px] font-medium mt-2.5">{ct.title}</p>
                  </div>
                ))
              )}
            </div>
            <div className="w-full">
              <div className="flex pl-2 items-center bg-input rounded-[7px] h-[90px]">
                <Input placeholder="0.00" value={amount} type="number" min={0} onChange={(e) => setAmount(e.target.value)} className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-[7px] bg-transparent px-0" />
                <div className="text-4xl text-[#5D5D53] mx-4">$</div>
              </div>
              <Input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-[7px] px-[17px] py-[10px]" />
              <Textarea placeholder="Izoh" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border-none focus:border-none outline-none shadow-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5" />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={addPending || !selectedCategory || !amount}
            className={`p-5 rounded-[7px] mt-1 ${dialogType === "parish" ? "bg-[#47B13C]" : "bg-[#EF5C12]"} text-white`}
          >
            {addPending ? (
              <span className="flex items-center gap-2"><Spinner className="h-4 w-4" />Qo'shilmoqda...</span>
            ) : dialogType === "parish" ? "Kirimga qo'shish" : "Chiqimga qo'shish"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getCashflowAvatar(item: TransactionItem): { name: string; url?: string; status: string } {
  const isOrder = item.tip === "order";
  const isIncome = item.type === "Приход";

  if (isOrder && !isIncome && item.order?.status === "canceled") {
    return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "return" };
  }
  if (isOrder && item.order?.seller) {
    if (item.order?.status === "rejected" || item.status === "rejected" || item.is_cancelled) {
      return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "fail" };
    }
    if (item.status === "approved" || item.order?.status === "accepted") {
      return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "success" };
    }
    return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "panding" };
  }
  if (item.is_cancelled || item.status === "rejected" || item.status === "cancelled") {
    return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "fail" };
  }
  return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "success" };
}

function CashflowRow({ item }: { item: TransactionItem }) {
  const queryClient = useQueryClient();
  const isOrder = item.tip === "order";
  const isIncome = item.type === "Приход";
  const avatar = getCashflowAvatar(item);

  const cashPrice = isOrder ? (item.order?.price || 0) : (item.price || 0);
  const terminalPrice = isOrder && isIncome ? (item.order?.plasticSum || 0) : 0;
  const typeName = item.cashflow_type?.title || (isOrder ? "Order" : "—");
  const typeColor = isIncome ? "#3ABC49" : "#EF5C12";
  const dateStr = item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—";
  const barCode = item.order?.bar_code;
  const additionalProfit = item.order?.additionalProfitSum || 0;
  const discount = item.order?.discountSum || 0;

  const [approveLoading, setApproveLoading] = useState(false);
  const canApprove = isOrder && item.status === "pending" && isIncome;

  const handleApprove = () => {
    setApproveLoading(true);
    UpdatePatchData(apiRoutes.cashflow + "/" + item.id, "accept", {})
      .then(() => { toast.success("Tasdiqlandi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] }); })
      .finally(() => setApproveLoading(false));
  };

  const [actionLoading, setActionLoading] = useState(false);
  const canReject = isOrder && item.status === "pending" && isIncome;
  const canReturn = isOrder && item.status === "approved" && item.order?.status !== "canceled" && isIncome;
  const canCancel = !isOrder && !item.is_cancelled && item.status !== "cancelled";

  const handleReject = () => {
    setActionLoading(true);
    PatchData(apiRoutes.order + "/reject/" + item.order?.id, {})
      .then(() => { toast.success("Bekor qilindi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] }); })
      .finally(() => setActionLoading(false));
  };

  const handleReturn = () => {
    setActionLoading(true);
    PatchData(apiRoutes.order + "/return/" + item.order?.id, {})
      .then(() => { toast.success("Qaytarildi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] }); })
      .finally(() => setActionLoading(false));
  };

  const handleCancel = () => {
    setActionLoading(true);
    UpdatePatchData(apiRoutes.cashflow + "/" + item.id, "cancel", {})
      .then(() => { toast.success("Bekor qilindi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] }); })
      .finally(() => setActionLoading(false));
  };

  return (
    <ListRow gridTemplate={cashflowGridTemplate} gridGap="16px">
      <div className="text-right">
        <span className={`text-[15px] font-medium ${isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
          {isIncome ? "+" : "-"} {formatPrice(cashPrice)}
        </span>
        {terminalPrice > 0 && (
          <p className="text-[15px] font-medium text-[#0078D4]">+ {formatPrice(terminalPrice)}</p>
        )}
      </div>

      <div className="flex items-center justify-center">
        <TebleAvatar size={42} name={avatar.name} url={avatar.url} status={avatar.status} />
      </div>

      <div className="flex items-center gap-[6px]">
        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
        <span className="text-[13px] font-medium text-[#1a1a1a]">{typeName}</span>
      </div>

      <span className="text-[13px] text-[#1a1a1a]">{dateStr}</span>

      <div className="flex items-center gap-[16px] text-[13px] text-[#1a1a1a] overflow-hidden">
        {isOrder && barCode ? (
          <>
            <span>{barCode.collection?.title}</span>
            <span>{barCode.model?.title}</span>
            <span>{barCode.size?.title}</span>
            <span>{barCode.color?.title}</span>
            <span>${formatPrice(barCode.collection?.collection_prices?.[0]?.priceMeter || barCode.collection?.priceMeter || 0)}</span>
            <span>{barCode.isMetric ? `${item.order?.kv || 0}sm` : `${item.order?.x || 0}x`}</span>
            {additionalProfit > 0 && <span className="text-[#47B13C] font-medium">+{formatPrice(additionalProfit)}$</span>}
            {discount > 0 && <span className="text-[#EF5C12] font-medium">-{formatPrice(discount)}$</span>}
          </>
        ) : (
          <span className="truncate">{item.comment || item.product || "—"}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-[4px]">
        {canApprove && (
          <button onClick={handleApprove} disabled={approveLoading} className="w-[42px] h-[42px] rounded-full bg-[#47B13C] flex items-center justify-center shrink-0 hover:bg-[#3da032] transition-colors disabled:opacity-50">
            {approveLoading ? <Loader className="w-[18px] h-[18px] text-white animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip_chk_fm)">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 3L9 10.5075L6.75 8.2575" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs><clipPath id="clip_chk_fm"><rect width="18" height="18" fill="white"/></clipPath></defs>
              </svg>
            )}
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
              <MoreVertical className="w-[16px] h-[16px] text-[#A3A3A3]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canReject && <DropdownMenuItem disabled={actionLoading} onClick={handleReject}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Bekor qilish</DropdownMenuItem>}
            {canReturn && <DropdownMenuItem disabled={actionLoading} onClick={handleReturn}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Qaytarish</DropdownMenuItem>}
            {canCancel && <DropdownMenuItem disabled={actionLoading} onClick={handleCancel}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Bekor qilish</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ListRow>
  );
}
