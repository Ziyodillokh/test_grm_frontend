import { useNavigate, useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowDown, ArrowUp, Lock, Loader } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { KassaPageColumns } from "@/pages/cashier/report/page/kassa-columns";
import UpdateCashflowDialog from "@/pages/cashier/report/page/update-cashflow-dialog";
import KassaToolbar from "@/pages/cashier/report/page/kassa-toolbar";
import { useKassaReportSingle } from "@/pages/reports/m-manager/filial-report-finance/queries";
import { formatNumber } from "@/utils/farmatNumber";
import { PatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "Терминал",
  discount: "Скидка",
  navar: "Навар",
};
const typeFilter: Record<string, string> = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};

export default function MonthlyKassaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [editCashflowId, setEditCashflowId] = useQueryState("editCashflowId", parseAsString);
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );
  const [search] = useQueryState("search", parseAsString);
  const [sellerId] = useQueryState("sellerId", parseAsString);
  const [cashflowTypeId] = useQueryState("cashflowTypeId", parseAsString);
  const [startDate] = useQueryState("startDate", parseAsString);
  const [endDate] = useQueryState("endDate", parseAsString);

  const { data: kassaData } = useKassaReportSingle({
    id: id || undefined,
    enabled: Boolean(id),
  });

  const { mutate: closeKassa, isPending: closePending } = useMutation({
    mutationFn: () => PatchData(apiRoutes.kassaClose, { ids: [id] }),
    onSuccess: () => {
      toast.success("Kassa muvaffaqiyatli yopildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    },
    onError: () => {
      toast.error("Kassani yopishda xatolik yuz berdi");
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
        cashflowSlug: tip === "collection" ? "Инкассация" : undefined,
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
  const activeFilter = tip;
  const hasActiveFilter = !!cashflowTypeId || !!sellerId || !!search || !!startDate || !!endDate;
  const displayIncome = hasActiveFilter ? (cashflowTotals?.totalIncome || 0) : (kassaData?.income || 0);
  const displayExpense = hasActiveFilter ? (cashflowTotals?.totalExpense || 0) : (kassaData?.expense || 0);

  const cards = [
    { label: "Umumiy sotuv", value: hasActiveFilter ? (cashflowTotals?.totalPrice || 0) : (kassaData?.sale || 0), dark: true },
    { label: "Qarz savdosi", value: hasActiveFilter ? (cashflowTotals?.totalDebtSum || 0) : (kassaData?.debt_sum || 0) },
    { label: "Terminal", value: hasActiveFilter ? (cashflowTotals?.plasticSum || 0) : (kassaData?.plasticSum || 0) },
    { label: "Qaytarilgan", value: hasActiveFilter ? -(cashflowTotals?.totalReturnSale || 0) : -(kassaData?.return_sale || 0), orange: true },
    { label: "Inkasatsiya", value: hasActiveFilter ? Math.abs(cashflowTotals?.totalCashCollection || 0) : Math.abs(kassaData?.cash_collection || 0) },
    { label: "Sotuv hajmi m²", value: hasActiveFilter ? (cashflowTotals?.kv || 0) : (kassaData?.totalSize || 0) },
    { label: "Navar foydasi", value: hasActiveFilter ? (cashflowTotals?.totalAdditionalProfit || 0) : (kassaData?.additionalProfitTotalSum || 0) },
    { label: "Chegirma", value: hasActiveFilter ? (cashflowTotals?.totalDiscount || 0) : (Number(kassaData?.discount) || 0), orange: true },
  ];

  const filterMap: Record<string, string> = {
    "Umumiy sotuv": "sale",
    "Qarz savdosi": "sale",
    Terminal: "terminal",
    Qaytarilgan: "return",
    Inkasatsiya: "collection",
    "Sotuv hajmi m²": "sale",
    "Navar foydasi": "navar",
    Chegirma: "discount",
  };

  const handleCardClick = (filterValue: string) => {
    setTip(activeFilter === filterValue ? null : filterValue);
  };

  const handleIncomeClick = () => {
    setTip(tip === "income" ? null : "income");
  };

  const handleExpenseClick = () => {
    setTip(tip === "expense" ? null : "expense");
  };

  return (
    <div className="px-4 pt-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => navigate("/f-manager/reports-hub")}
        />
        <span
          className="cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => navigate("/f-manager/reports-hub")}
        >
          Oylik hisobotlar
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-foreground font-medium">
          {kassaData?.filial?.name || "Kassa"}{kassaData?.month ? ` — ${kassaData.month}-oy` : ""}
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <KassaToolbar kassaId={id || ""} />
        {kassaData?.status === "warning" && (
          <Button
            onClick={() => closeKassa()}
            disabled={closePending}
            className="bg-primary text-background rounded-lg px-5 py-2.5 text-[14px] font-medium"
          >
            {closePending ? (
              <Loader className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-1" />
            )}
            Oylik hisobotni yopish
          </Button>
        )}
      </div>

      {/* Cards */}
      <div className="flex gap-3 mb-4">
        {/* Total card */}
        <div
          onClick={() => handleCardClick("")}
          className="bg-[#48B533] text-white rounded-xl p-5 min-w-[280px] cursor-pointer"
        >
          <p className="text-[32px] font-bold leading-tight">
            ${formatNumber(kassaData?.in_hand || 0)}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[14px] opacity-90">
            <span
              className={`flex items-center gap-1 cursor-pointer hover:opacity-100 ${tip === "income" ? "opacity-100 underline" : ""}`}
              onClick={(e) => { e.stopPropagation(); handleIncomeClick(); }}
            >
              <ArrowDown className="w-3.5 h-3.5" />${formatNumber(displayIncome)}
            </span>
            <span
              className={`flex items-center gap-1 cursor-pointer hover:opacity-100 ${tip === "expense" ? "opacity-100 underline" : ""}`}
              onClick={(e) => { e.stopPropagation(); handleExpenseClick(); }}
            >
              <ArrowUp className="w-3.5 h-3.5" />${formatNumber(displayExpense)}
            </span>
          </div>
          <p className="text-[13px] mt-2 opacity-80">
            Saldo balans — ${formatNumber(kassaData?.opening_balance || 0)}
          </p>
        </div>

        {/* Small cards 2x4 grid */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {cards.map((card) => {
            const filterVal = filterMap[card.label] || "";
            const isActive = activeFilter === filterVal && filterVal !== "";

            return (
              <div
                key={card.label}
                onClick={() => handleCardClick(filterVal)}
                className={`rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  card.orange
                    ? isActive
                      ? "bg-[#c46d3f] text-white"
                      : "bg-[#E38157] text-white"
                    : card.dark
                      ? isActive
                        ? "bg-[#2d5a1f] text-white"
                        : "bg-[#3d6b2e] text-white"
                      : isActive
                        ? "bg-primary text-background"
                        : "bg-card border border-border"
                }`}
              >
                <p className="text-[16px] font-bold">
                  {card.value < 0 ? "-" : ""}
                  {formatNumber(Math.abs(card.value))}
                </p>
                <p className="text-[12px] mt-1 opacity-70">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="h-[calc(100vh-280px)] scrollCastom">
        <DataTable
          columns={KassaPageColumns}
          data={flatData || []}
          isLoading={isLoading}
          hasHeader={true}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      {/* Update Dialog */}
      <UpdateCashflowDialog
        editId={editCashflowId}
        onClose={() => setEditCashflowId(null)}
        item={flatData.find((i: any) => String(i.id) === editCashflowId)}
      />
    </div>
  );
}
