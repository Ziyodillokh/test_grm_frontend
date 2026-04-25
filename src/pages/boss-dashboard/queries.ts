import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export type BossDashboardFilter = {
  filialId?: string;
  month?: number | string;
  year?: number | string;
};

// 1) Joriy oy / Umumiy hisobot ma'lumotlari (chap kolonka — Joriy oy + Foyda/Xarajat/Qaytgan + kassa)
export const useCurrentMonthOverview = (queries: BossDashboardFilter, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.reportsHomePageCurrentMonth, queries],
    queryFn: () =>
      getAllData<any, BossDashboardFilter>(apiRoutes.reportsHomePageCurrentMonth, {
        month: queries.month ? String(queries.month) : undefined,
        year: queries.year ? Number(queries.year) : undefined,
        filial_id: queries.filialId,
      } as any),
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
    queryKey: [apiRoutes.debtReport, "boss-card", queries],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.debtReport, {
        year: queries.year ? Number(queries.year) : undefined,
        month: queries.month ? Number(queries.month) : undefined,
        page: 1,
        limit: 1,
      }),
    enabled,
  });

// Qarz (client debt) card
export const useClientDebtTotal = (filialId?: string, enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.clientDebtTotal, filialId],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.clientDebtTotal, filialId ? { filial_id: filialId } : {}),
    enabled,
  });

// Filiallar ro'yxati (Filial filter uchun) — faqat type=filial (warehouse'siz)
export const useFilialsList = () =>
  useQuery({
    queryKey: [apiRoutes.filial, "boss-filter"],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filial, { type: "filial", limit: 200, page: 1 }),
  });
