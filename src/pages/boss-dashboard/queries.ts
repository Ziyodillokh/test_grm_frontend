import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export type BossDashboardFilter = {
  filialId?: string;
  month?: number | string;
  year?: number | string;
};

// 1) Umumiy hisobot ma'lumotlari (Joriy oy/Foyda/Xarajat/Qaytgan — bir xil endpoint)
export const useMonthlyV2 = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.reportsMonthlyV2, queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.reportsMonthlyV2, {
        month: queries.month ? Number(queries.month) : undefined,
        year: queries.year ? Number(queries.year) : undefined,
        filialId: queries.filialId,
      }),
    enabled,
  });

// LEGACY: faqat manager/accountant kassa progress uchun (income/expense)
export const useCurrentMonthOverview = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.reportsHomePageCurrentMonth, queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.reportsHomePageCurrentMonth, {
        month: queries.month ? String(queries.month) : undefined,
        year: queries.year ? Number(queries.year) : undefined,
        filial_id: queries.filialId,
      }),
    enabled,
  });

// 2) Yillik aylanma (header right balance)
export const useYearlyTotal = (year: number | string, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.reportsTotal, year],
    queryFn: () =>
      getAllData<any, { year?: number }>(apiRoutes.reportsTotal, {
        year: year ? Number(year) : undefined,
      }),
    enabled,
  });

// 3) Card-specific: each report's totals
// Note: M-manager pages use these endpoints already; we reuse them here as parallel queries.

// Diller card
export const useDealerCardTotals = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.dealerReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.dealerReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Zavod card
export const useFactoryCardTotals = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.factoryDebtReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.factoryDebtReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Logistika card
export const useLogisticsCardTotals = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.logisticsReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.logisticsReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Bojxona card
export const useCustomsCardTotals = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.customsReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.customsReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Kent (debt) card
export const useKentsCardTotals = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.streetReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.streetReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Qarz (client debt) card — yillik qaytarilgan + qoldiq qarz
export const useClientDebtSummary = (year?: number | string, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.clientDebtSummary, year],
    queryFn: () =>
      getAllData<{ totalDebt: number; totalReturned: number }, { year?: number }>(
        apiRoutes.clientDebtSummary,
        { year: year ? Number(year) : undefined }
      ),
    enabled,
  });

// Filiallar ro'yxati (Filial filter uchun) — faqat type=filial (warehouse'siz)
export const useFilialsList = () =>
  useQuery({
    queryKey: [apiRoutes.filial, "boss-filter"],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filial, { type: "filial", limit: 200, page: 1 }),
  });

// Boss cashflow page: user (manager/accountant) cashflowlari shu oydagi reportga tegishli
export const useBossCashflowList = (params: {
  createdByRole?: number;
  reportMonth?: number;
  reportYear?: number;
  type?: "income" | "expense";
  cashflowSlug?: string;
  enabled?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.cashflow, "boss-dashboard", params],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<any, any>(apiRoutes.cashflow, {
        createdByRole: params.createdByRole,
        reportMonth: params.reportMonth,
        reportYear: params.reportYear,
        type: params.type,
        cashflowSlug: params.cashflowSlug,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return null;
      return meta.currentPage < meta.totalPages ? meta.currentPage + 1 : null;
    },
    initialPageParam: 1,
    enabled: params.enabled !== false && params.createdByRole !== undefined,
  });

// Cashflow types — Tip filter dropdown uchun
export const useCashflowTypesForBoss = () =>
  useQuery({
    queryKey: ["/cashflow-types/by/managers", "boss-cashflow"],
    queryFn: () => getAllData<any[], any>("/cashflow-types/by/managers/both", {}),
  });

// Filtersiz totals — saldo card uchun (filter saldo'ga ta'sir qilmaydi)
export const useBossCashflowTotals = (params: {
  createdByRole?: number;
  reportMonth?: number;
  reportYear?: number;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.cashflow, "boss-totals", params],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.cashflow, {
        createdByRole: params.createdByRole,
        reportMonth: params.reportMonth,
        reportYear: params.reportYear,
        page: 1,
        limit: 1,
      }),
    enabled: params.enabled !== false && params.createdByRole !== undefined,
  });
