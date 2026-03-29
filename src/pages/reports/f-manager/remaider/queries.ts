import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { ICountryReportData, IModelData, TQuery } from "./type";
import { TResponse } from "@/types";
import { TData } from "@/pages/filial/type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
}

interface IcountryReport {
  options?: DefinedInitialDataInfiniteOptions<ICountryReportData>;
  queries?: TQuery;
  enabled: boolean;
}

interface IModelReport  {
  options?: DefinedInitialDataInfiniteOptions<IModelData>;
  queries?: TQuery;
  enabled: boolean;
}


export const usefilialWarehouseFetch = ({ options, queries }: ITransfers) =>
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
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

export const useCountryReport = ({
  options,
  enabled,
  queries,
}: IcountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [queries?.typeOther == "none"? apiRoutes.countryReportMonthly:apiRoutes.countryOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none"? apiRoutes.countryReportMonthly:apiRoutes.countryOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.meta?.pagination?.page <=
        lastPage?.meta?.pagination?.totalPages
      ) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      } else {
        return null;
      }
    },
    enabled,
    initialPageParam: 1,
  });

export const useFactoryReport = ({
  options,
  enabled,
  queries,
}: IcountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [ queries?.typeOther == "none"? apiRoutes.factoryReportMonthly:apiRoutes.factoryOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none"? apiRoutes.factoryReportMonthly:apiRoutes.factoryOrderReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.meta?.pagination?.page <=
        lastPage?.meta?.pagination?.totalPages
      ) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      } else {
        return null;
      }
    },
    enabled,
    initialPageParam: 1,
  });

export const useCollectionReport = ({
  options,
  enabled,
  queries,
}: IcountryReport) =>
  useInfiniteQuery({
    ...options,
    queryKey: [ queries?.typeOther == "none"? apiRoutes.collectionReportMonthly:apiRoutes.collectionOrderReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ICountryReportData, TQuery>(queries?.typeOther == "none"? apiRoutes.collectionReportMonthly:apiRoutes.collectionOrderReport,  {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.meta?.pagination?.page <=
        lastPage?.meta?.pagination?.totalPages
      ) {
        return Number(lastPage?.meta?.pagination?.page) + 1;
      } else {
        return null;
      }
    },
    enabled,
    initialPageParam: 1,
  });

  export const useModelReport = ({
    options,
    enabled,
    queries,
  }: IModelReport) =>
    useInfiniteQuery({
      ...options,
      queryKey: [queries?.typeOther == "none"? apiRoutes.modelReport:apiRoutes.modelsOrderReport,  queries],
      queryFn: ({ pageParam = 1 }) =>
        getAllData<IModelData, TQuery>(queries?.typeOther == "none"? apiRoutes.modelReport:apiRoutes.modelsOrderReport, {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit || 10,
        }),
      getNextPageParam: (lastPage) => {
        if (
          lastPage?.meta?.pagination?.page <=
          lastPage?.meta?.pagination?.totalPages
        ) {
          return Number(lastPage?.meta?.pagination?.page) + 1;
        } else {
          return null;
        }
      },
      enabled,
      initialPageParam: 1,
    });
  

    export const useSizeReport = ({
      options,
      enabled,
      queries,
    }: IModelReport) =>
      useInfiniteQuery({
        ...options,
        queryKey: [ queries?.typeOther == "none"? apiRoutes.SizeReport:apiRoutes.sizeOrderReport, queries],
        queryFn: ({ pageParam = 1 }) =>
          getAllData<IModelData, TQuery>(queries?.typeOther == "none"? apiRoutes.SizeReport:apiRoutes.sizeOrderReport, {
            ...queries,
            page: pageParam as number,
            limit: queries?.limit || 10,
          }),
        getNextPageParam: (lastPage) => {
          if (
            lastPage?.meta?.pagination?.page <=
            lastPage?.meta?.pagination?.totalPages
          ) {
            return Number(lastPage?.meta?.pagination?.page) + 1;
          } else {
            return null;
          }
        },
        enabled,
        initialPageParam: 1,
      });
    