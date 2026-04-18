import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { KassaPageColumns } from "@/pages/cashier/report/page/kassa-columns";
import KassaToolbar from "@/pages/cashier/report/page/kassa-toolbar";
import { apiRoutes } from "@/service/apiRoutes";
import { getByIdData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import ReportTotals from "@/pages/reports/m-manager/report-finance/monthly/report-totals";
import { useMemo } from "react";

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

export default function DashboardKassaDetail() {
  const { id } = useParams();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
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

  const { data: kassaData } = useQuery({
    queryKey: [apiRoutes.kassa, id],
    queryFn: () =>
      getByIdData<TKassareportData, object>(apiRoutes.kassa, id || ""),
    enabled: Boolean(id),
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
  const hasActiveFilter = !!cashflowTypeId || !!sellerId || !!search || !!startDate || !!endDate;

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

  return (
    <div className="flex flex-col h-full">
      {/* Yashil card + 8 ta metrika */}
      <ReportTotals
        data={reportTotalsData}
        filteredTotals={filteredTotals}
        hasActiveFilter={hasActiveFilter}
      />

      {/* Toolbar */}
      <div className="shrink-0 my-[10px]">
        <KassaToolbar kassaId={id || ""} />
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom">
        <DataTable
          columns={KassaPageColumns.filter(col => col.id !== 'harakatlar')}
          data={flatData || []}
          isLoading={isLoading}
          hasHeader={true}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
