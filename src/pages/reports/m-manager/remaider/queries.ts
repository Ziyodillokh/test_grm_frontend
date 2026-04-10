import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { InventoryResponse, PartiyaResponse, TQuery, ICountryReportData, IModelData } from "./type";
import { TResponse } from "@/types";
import { TData } from "@/pages/filial/type";

interface IInventoryQuery {
  queries?: TQuery;
  enabled?: boolean;
}

export const useFilialSnapshot = ({ queries, enabled = true }: IInventoryQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.inventoryFilialSnapshot, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<InventoryResponse, TQuery>(apiRoutes.inventoryFilialSnapshot, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useFilialList = ({ enabled = true }: { enabled?: boolean }) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.filialWarehouse],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filialWarehouse, { limit: 100, page: 1 }),
    getNextPageParam: () => null,
    enabled,
    initialPageParam: 1,
  });

export const usePartiyaSnapshot = ({ queries, enabled = true }: IInventoryQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.inventoryPartiyaSnapshot, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<PartiyaResponse, TQuery>(apiRoutes.inventoryPartiyaSnapshot, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

// ── Legacy hooks (used by dashboard and other pages) ──

interface ILegacyTransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
}

interface ILegacyCountryReport {
  options?: DefinedInitialDataInfiniteOptions<ICountryReportData>;
  queries?: TQuery;
  enabled: boolean;
}

interface ILegacyModelReport {
  options?: DefinedInitialDataInfiniteOptions<IModelData>;
  queries?: TQuery;
  enabled: boolean;
}

export const usefilialWarehouseFetch = ({ options, queries }: ILegacyTransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.filialWarehouse, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.filialWarehouse, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      }
      return null;
    },
    initialPageParam: 1,
  });

export const useCountryReport = ({ options, enabled, queries }: ILegacyCountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.countryReportMonthly : apiRoutes.countryOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none" ? apiRoutes.countryReportMonthly : apiRoutes.countryOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.pagination?.page <= lastPage?.meta?.pagination?.totalPages) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useFactoryReport = ({ options, enabled, queries }: ILegacyCountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.factoryReportMonthly : apiRoutes.factoryOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none" ? apiRoutes.factoryReportMonthly : apiRoutes.factoryOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.pagination?.page <= lastPage?.meta?.pagination?.totalPages) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useCollectionReport = ({ options, enabled, queries }: ILegacyCountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.collectionReportMonthly : apiRoutes.collectionOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none" ? apiRoutes.collectionReportMonthly : apiRoutes.collectionOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.pagination?.page <= lastPage?.meta?.pagination?.totalPages) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useModelReport = ({ options, enabled, queries }: ILegacyModelReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.modelReport : apiRoutes.modelsOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<IModelData, TQuery>(queries?.typeOther == "none" ? apiRoutes.modelReport : apiRoutes.modelsOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.pagination?.page <= lastPage?.meta?.pagination?.totalPages) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useSizeReport = ({ options, enabled, queries }: ILegacyModelReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none" ? apiRoutes.SizeReport : apiRoutes.sizeOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<IModelData, TQuery>(queries?.typeOther == "none" ? apiRoutes.SizeReport : apiRoutes.sizeOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.pagination?.page <= lastPage?.meta?.pagination?.totalPages) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });
