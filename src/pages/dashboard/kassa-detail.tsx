import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import qs from "qs";

import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { useDataCashflow } from "@/pages/cashflow/queries";
import { apiRoutes } from "@/service/apiRoutes";
import { getByIdData, getAllData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { useMeStore } from "@/store/me-store";
import useData from "@/pages/employees/table/queries";
import type { CashflowType } from "@/components/adding-parish-flow";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  saldo: "cashflow",
  collection: "cashflow",
  sale: "order",
  return: "order",
  terminal: "terminal",
  discount: "discount",
  navar: "markup",
  debt: "debt",
};
const typeFilter: Record<string, string> = {
  income: "income",
  expense: "expense",
  saldo: "income",
  sale: "income",
  return: "expense",
};

import { CashflowRow, cashflowGridTemplate, cashflowLabels } from "@/components/cashflow-row";
import UpdateCashflowDialog from "@/pages/reports/m-manager/report/update-cashflow-dialog";
import ReportToolbar from "@/components/report-toolbar";

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
  const [search] = useQueryState("search", parseAsString);
  const [sellerId, setSellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId, setCashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);

  const [editCashflowId, setEditCashflowId] = useState<string | null>(null);

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
        cashflowSlug: tip === "collection" ? "cashCollection" : tip === "saldo" ? "balance" : undefined,
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
      totalCashCollection: kassaData?.cashCollection ?? 0,
      totalDiscount: kassaData?.discount ?? 0,
      totalSaleReturn: kassaData?.saleReturn ?? 0,
      managerSum: kassaData?.inHand ?? 0,
      managerSaldo: kassaData?.openingBalance ?? 0,
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
  };

  const handleCardClick = (filterValue: string) => {
    setTip(tip === filterValue ? null : filterValue);
  };

  const handleIncomeClick = () => {
    setTip(tip === "income" ? null : "income");
  };

  const handleSaldoClick = () => {
    setTip(tip === "saldo" ? null : "saldo");
  };

  const handleExpenseClick = () => {
    setTip(tip === "expense" ? null : "expense");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Unified toolbar: search/sort/filter/excel */}
      <ReportToolbar
        hasActiveFilter={hasActiveFilter}
        onClearFilters={clearFilters}
        onExport={() => exportExcel()}
        excelPending={excelPending}
        filterCols={1}
        filterContent={
          <div className="flex flex-col gap-[10px]">
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Sotuvchi</p>
              <div className="bg-white rounded-[8px]">
                <FilterSelect
                  name="sellerId"
                  placeholder="Sotuvchi tanlang"
                  className="w-full"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...sellers.map((s: any) => ({
                      label: `${s.firstName} ${s.lastName}`,
                      value: s.id,
                    })),
                  ]}
                />
              </div>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Turi</p>
              <div className="bg-white rounded-[8px]">
                <FilterSelect
                  name="cashflowTypeId"
                  placeholder="Turni tanlang"
                  className="w-full"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Barchasi", value: "clear" },
                    ...cashflowTypes.map((ct) => ({
                      label: ct.title,
                      value: ct.id,
                    })),
                  ]}
                />
              </div>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Sana oralig'i</p>
              <div className="bg-white rounded-[8px]">
                <DateRangePicker
                  fromPlaceholder="Dan"
                  toPlaceholder="Gacha"
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        }
      />

      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        filteredTotals={filteredTotals}
        hasActiveFilter={hasActiveFilter}
        onCardClick={handleCardClick}
        onIncomeClick={handleIncomeClick}
        onExpenseClick={handleExpenseClick}
        onSaldoClick={handleSaldoClick}
        activeFilter={tip || undefined}
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
            {flatData.map((item: any, i: number) => {
              const isWarning = kassaData?.kassaStatus === 1;
              return (
                <CashflowRow
                  key={item?.id || i}
                  item={item}
                  isWarning={isWarning}
                  // Tahrirlash hammasida (open + warning kassa, order + cashflow)
                  onEdit={(cf: any) => setEditCashflowId(String(cf.id))}
                />
              );
            })}
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

      <UpdateCashflowDialog
        editId={editCashflowId}
        onClose={() => setEditCashflowId(null)}
        item={flatData.find((i: any) => String(i.id) === editCashflowId) as any}
      />
    </div>
  );
}

