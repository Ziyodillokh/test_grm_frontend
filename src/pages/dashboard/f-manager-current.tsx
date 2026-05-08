import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListRow } from "@/components/ui/list-row";
import { parseAsString, useQueryState } from "nuqs";
import { Loader, MoreVertical, Plus, Lock, CheckCircle } from "lucide-react";
import qs from "qs";
import { toast } from "sonner";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { useDataCashflow } from "@/pages/cashflow/queries";
import { useOpenKassa } from "@/pages/report/table/queries";
import { useKassaReportSingle } from "@/pages/reports/m-manager/filial-report-finance/queries";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData, AddData, PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import UpdateCashflowDialog from "@/pages/reports/m-manager/report/update-cashflow-dialog";
import { useDebtClients } from "@/pages/reports/m-manager/reports-hub/client-debt/queries";
import { useMeStore } from "@/store/me-store";
import useData from "@/pages/employees/table/queries";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import { Spinner } from "@/components/ui/spinner";
import type { CashflowType } from "@/components/adding-parish-flow";
import type { TransactionItem } from "@/pages/cashflow/types";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "terminal",
  discount: "discount",
  navar: "markup",
  debt: "debt",
  saldo: "cashflow",
};
const typeFilter: Record<string, string> = {
  income: "income",
  expense: "expense",
  sale: "income",
  return: "expense",
};

const cashflowGridTemplate = "max-content 60px minmax(100px,max-content) minmax(110px,max-content) 1fr 70px";
const cashflowLabels = [
  { text: "Summa", right: true },
  { text: "Status", center: true },
  { text: "Turi" },
  { text: "Sana" },
  { text: "Malumotlar" },
  { text: "" },
];

export default function FManagerCurrent({ kassaIdProp }: { kassaIdProp?: string } = {}) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState("sortSingle", parseAsString.withDefault("Все"));
  const [id] = useQueryState("id");
  const [search] = useQueryState("search", parseAsString);
  const [sellerId, setSellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId, setCashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"parish" | "flow">("parish");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [editCashflowId, setEditCashflowId] = useState<string | null>(null);

  // F-Manager o'z kassasi (faqat kassaIdProp bo'lmaganda)
  const { data: openKassaData } = useOpenKassa({
    id: kassaIdProp ? undefined : meUser?.filial?.id,
  });

  // Kassa by ID (faqat kassaIdProp bo'lganda — oylik hisobotdan kelganda)
  const { data: kassaByIdData } = useKassaReportSingle({
    id: kassaIdProp,
    enabled: Boolean(kassaIdProp),
  });

  const reportData = kassaIdProp ? kassaByIdData : openKassaData;
  const kassaId = kassaIdProp || reportData?.id || id || "";
  const kassaStatus = (reportData as any)?.status;

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

  // Qarzdorlar (slug='debt' tanlanganda)
  const { data: debtorsData } = useDebtClients(meUser?.filial?.id, "qarzdor", 1, 200);
  const debtors = (debtorsData as any)?.items || [];

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
    setClientId("");
    setAmount("");
    setComment("");
    setDate("");
    setDialogOpen(true);
  };

  const selectedCategorySlug = useMemo(
    () => (cashflowTypesData as unknown as CashflowType[])?.find((ct) => ct.id === selectedCategory)?.slug,
    [selectedCategory, cashflowTypesData],
  );
  const isDebtCategory = selectedCategorySlug === "debt";

  const handleSubmit = () => {
    if (!selectedCategory) { toast.error("Turni tanlang"); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error("Summani kiriting"); return; }
    if (isDebtCategory && !clientId) { toast.error("Qarzdorni tanlang"); return; }
    addCashflow({
      price: parseFloat(amount),
      type: dialogType === "parish" ? "income" : "expense",
      comment,
      ...(date ? { date } : {}),
      ...(isDebtCategory && clientId ? { clientId } : {}),
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

  // Oyni yopish (warning status)
  const { mutate: closeKassa, isPending: closePending } = useMutation({
    mutationFn: () => PatchData(apiRoutes.kassaClose, { ids: [kassaId] }),
    onSuccess: () => {
      toast.success("Kassa muvaffaqiyatli yopildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
    },
    onError: () => toast.error("Kassani yopishda xatolik"),
  });

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
        cashflowSlug: tip === "collection" ? "cashCollection" : tip === "saldo" ? "balance" : undefined,
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
      totalCashCollection: reportData?.cashCollection ?? 0,
      totalDiscount: reportData?.discount ?? 0,
      totalSaleReturn: reportData?.saleReturn ?? 0,
      managerSum: reportData?.inHand ?? 0,
      managerSaldo: reportData?.openingBalance ?? 0,
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
  };

  const handleCardClick = (filterValue: string) => {
    setTip(tip === filterValue ? null : filterValue);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar — reusable component */}
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          onExport={() => exportExcel()}
          excelPending={excelPending}
          filterContent={
            <>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Sotuvchi</p>
                <FilterSelect
                  variant="filter"
                  name="sellerId"
                  placeholder="Sotuvchi tanlang"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...sellers.map((s: any) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id })),
                  ]}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  name="cashflowTypeId"
                  placeholder="Turni tanlang"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...cashflowTypes.map((ct) => ({ label: ct.title, value: ct.id })),
                  ]}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Sana oralig'i</p>
                <DateRangePicker variant="filter" fromPlaceholder="...dan" toPlaceholder="...gacha" />
              </div>
            </>
          }
          actions={
            <>
              {(!kassaStatus || kassaStatus === "open" || kassaStatus === "warning") && (
                <>
                  {kassaStatus === "warning" ? (
                    <Button
                      onClick={() => closeKassa()}
                      disabled={closePending}
                      className="h-[42px] bg-[#EF5C12] hover:bg-[#d4500f] text-white rounded-sm px-[16px] text-[13px] font-medium"
                    >
                      {closePending ? (
                        <Loader className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4 mr-[4px]" />
                      )}
                      Oyni yopish
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => openDialog("parish")}
                        className="h-[42px] bg-[#47B13C] hover:bg-[#3da032] text-white rounded-sm px-[16px] text-[13px] font-medium"
                      >
                        <Plus className="w-[16px] h-[16px] mr-[4px]" />
                        Kirim
                      </Button>
                      <Button
                        onClick={() => openDialog("flow")}
                        className="h-[42px] bg-[#EF5C12] hover:bg-[#d4500f] text-white rounded-sm px-[16px] text-[13px] font-medium"
                      >
                        <Plus className="w-[16px] h-[16px] mr-[4px]" />
                        Chiqim
                      </Button>
                    </>
                  )}
                </>
              )}
              {(kassaStatus === "closed" || kassaStatus === "closed_by_d") && (
                <div className="flex items-center gap-2 bg-[#FFA91E]/10 text-[#FFA91E] rounded-sm px-4 h-[42px] text-[14px] font-medium">
                  <Lock className="w-4 h-4" />
                  Yopilgan
                </div>
              )}
              {kassaStatus === "accepted" && (
                <div className="flex items-center gap-2 bg-[#47B13C]/10 text-[#47B13C] rounded-sm px-4 h-[42px] text-[14px] font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Tasdiqlangan
                </div>
              )}
            </>
          }
        />
      </div>

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        filteredTotals={filteredTotals}
        hasActiveFilter={hasActiveFilter}
        activeFilter={tip}
        onCardClick={handleCardClick}
        onIncomeClick={() => setTip(tip === "income" ? null : "income")}
        onExpenseClick={() => setTip(tip === "expense" ? null : "expense")}
        onSaldoClick={() => setTip(tip === "saldo" ? null : "saldo")}
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
              <CashflowRow
                key={item?.id || i}
                item={item}
                isWarning={kassaStatus === "warning" || (reportData as any)?.kassaStatus === 1}
                onEdit={(cf: any) => setEditCashflowId(String(cf.id))}
              />
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
        <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-sm">
          <div className={`p-1 h-[30px] pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[35px] ${dialogType === "parish" ? "bg-[#47B13C]" : "bg-[#EF5C12]"} text-white`}>
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
                    className={`w-[calc(50%-2px)] h-22 bg-input flex items-center justify-center flex-col rounded-sm text-center cursor-pointer ${
                      selectedCategory === ct.id ? (dialogType === "parish" ? "ring-2 ring-[#47B13C]" : "ring-2 ring-[#EF5C12]") : ""
                    }`}
                  >
                    <p className="text-primary text-[13px] font-medium mt-2.5">{ct.title}</p>
                  </div>
                ))
              )}
            </div>
            <div className="w-full">
              <div className="flex pl-2 items-center bg-input rounded-sm h-[90px]">
                <Input placeholder="0.00" value={amount} type="number" min={0} onChange={(e) => setAmount(e.target.value)} className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-sm bg-transparent px-0" />
                <div className="text-4xl text-[#5D5D53] mx-4">$</div>
              </div>
              <Input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-sm px-[17px] py-[10px]" />
              {isDebtCategory && (
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-sm px-[17px] py-[10px] bg-input outline-none"
                >
                  <option value="">Qarzdorni tanlang…</option>
                  {debtors.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} {d.phone ? `— ${d.phone}` : ""}
                    </option>
                  ))}
                </select>
              )}
              <Textarea placeholder="Izoh" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border-none focus:border-none outline-none shadow-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5" />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={addPending || !selectedCategory || !amount}
            className={`p-5 rounded-sm mt-1 ${dialogType === "parish" ? "bg-[#47B13C]" : "bg-[#EF5C12]"} text-white`}
          >
            {addPending ? (
              <span className="flex items-center gap-2"><Spinner className="h-4 w-4" />Qo'shilmoqda...</span>
            ) : dialogType === "parish" ? "Kirimga qo'shish" : "Chiqimga qo'shish"}
          </Button>
        </DialogContent>
      </Dialog>

      <UpdateCashflowDialog
        editId={editCashflowId}
        onClose={() => setEditCashflowId(null)}
        item={flatData.find((i: any) => String(i.id) === editCashflowId) as any}
      />
    </div>
  );
}

function getCashflowAvatar(item: TransactionItem): { name: string; url?: string; status: string } {
  const isOrder = item.tip === "order";
  const isIncome = item.type === "income";

  if (isOrder && !isIncome && item.order?.status === "returned") {
    return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "return" };
  }
  if (isOrder && item.order?.seller) {
    if (item.order?.status === "rejected" || item.status === "rejected" || item.isCancelled) {
      return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "fail" };
    }
    if (item.status === "approved" || item.order?.status === "accepted") {
      return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "success" };
    }
    return { name: item.order.seller.firstName, url: item.order.seller.avatar?.path, status: "panding" };
  }
  if (item.isCancelled || item.status === "rejected" || item.status === "cancelled") {
    return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "fail" };
  }
  return { name: item.createdBy?.firstName || "?", url: item.createdBy?.avatar?.path, status: "success" };
}

function CashflowRow({ item, isWarning, onEdit }: { item: TransactionItem; isWarning?: boolean; onEdit?: (item: TransactionItem) => void }) {
  const queryClient = useQueryClient();
  const isOrder = item.tip === "order";
  const isIncome = item.type === "income";
  const avatar = getCashflowAvatar(item);

  // order.price = NAQD (cash), order.plastic = TERMINAL, order.debtAmount = QARZ
  const orderPlastic = item.order?.plastic ?? item.order?.plasticSum ?? 0;
  const orderPrice = item.order?.price ?? 0;
  const orderDebt = Number((item.order as any)?.debtAmount ?? 0);
  const cashPrice = isOrder ? orderPrice : (item.price || 0);
  const terminalPrice = isOrder && isIncome ? orderPlastic : 0;
  const debtPrice = isOrder && isIncome ? orderDebt : 0;
  const isOrderDebt = isOrder && (item.order as any)?.isDebt;
  const typeName = item.cashflow_type?.title || (isOrder ? "Order" : "—");
  const typeColor = isIncome ? "#3ABC49" : "#EF5C12";
  const dateStr = item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—";
  const barCode = item.order?.bar_code;
  const additionalProfit = item.order?.additionalProfit ?? item.order?.additionalProfitSum ?? 0;
  const discount = item.order?.discount ?? item.order?.discountSum ?? 0;

  const [approveLoading, setApproveLoading] = useState(false);
  const canApprove = isOrder && item.status === "pending" && isIncome;
  void isWarning;

  const handleApprove = () => {
    setApproveLoading(true);
    UpdatePatchData(apiRoutes.cashflow + "/" + item.id, "accept", {})
      .then(() => { toast.success("Tasdiqlandi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] }); })
      .finally(() => setApproveLoading(false));
  };

  const [actionLoading, setActionLoading] = useState(false);
  const isOrderReturned = item.order?.status === "returned";
  const canReject = isOrder && item.status === "pending" && isIncome;
  const canReturn = isOrder && !isOrderReturned && isIncome && item.status === "approved";
  const canCancel = !isOrder && !item.isCancelled && item.status !== "cancelled";
  const canEdit = !!onEdit && !(isOrder && isOrderReturned && isIncome);

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
      <div className="flex flex-col items-end whitespace-nowrap leading-tight">
        {cashPrice > 0 && (
          <span className={`text-[15px] font-medium ${isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
            {isIncome ? "+" : "-"} {formatPrice(cashPrice)}
          </span>
        )}
        {terminalPrice > 0 && (
          <span className="text-[15px] font-medium text-[#0078D4]">+ {formatPrice(terminalPrice)}</span>
        )}
        {debtPrice > 0 && (
          <span className="text-[13px] font-medium text-[#EC6724]">+ {formatPrice(debtPrice)}</span>
        )}
        {cashPrice === 0 && terminalPrice === 0 && debtPrice === 0 && (
          <span className="text-[15px] font-medium text-[#1a1a1a]">0</span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <TebleAvatar size={42} name={avatar.name} url={avatar.url} status={avatar.status} />
      </div>

      <div className="flex items-center gap-[6px] whitespace-nowrap">
        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
        <span className="text-[13px] font-medium text-[#1a1a1a]">{typeName}</span>
        {isOrderDebt && (
          <span className="text-[11px] font-medium text-[#EC6724] bg-[#fff5e6] px-[6px] py-[1px] rounded-full">
            Qarz
          </span>
        )}
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
            <span>{barCode.isMetric ? `${item.order?.x || 0}sm` : `${item.order?.x || 0}x`}</span>
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
            {canEdit && <DropdownMenuItem onClick={() => onEdit?.(item)}>Tahrirlash</DropdownMenuItem>}
            {canReturn && <DropdownMenuItem disabled={actionLoading} onClick={handleReturn}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Qaytarish</DropdownMenuItem>}
            {canReject && <DropdownMenuItem disabled={actionLoading} onClick={handleReject}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Bekor qilish</DropdownMenuItem>}
            {canCancel && <DropdownMenuItem disabled={actionLoading} onClick={handleCancel}>{actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}Bekor qilish</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ListRow>
  );
}
