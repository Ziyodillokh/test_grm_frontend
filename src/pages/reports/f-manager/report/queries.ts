import { DefinedInitialDataOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import {  TData, TKassareportData, TQuery, TKassaReportQuery } from "./type";

interface IKassaData {
  options?: DefinedInitialDataOptions<TResponse<TData>>;
  queries?: TQuery;
  enabled?: boolean
}

interface IKassareport {
  options?: DefinedInitialDataOptions<TKassareportData>;
  queries?: TKassaReportQuery;
  enabled?: boolean;
}

export const useDataKassa = ({ queries ,enabled}: IKassaData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.kassa, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.kassa, {
        ...queries,
        page: pageParam as number,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    enabled: enabled,
    initialPageParam: 1,
  });

  export const useKassaReportTotal= ({ options, queries,enabled }: IKassareport) =>
    useQuery({
      ...options,
      queryKey: [apiRoutes.kassaReportTotal,queries],
      enabled,
      queryFn: () =>
        getAllData<TKassareportData, TKassaReportQuery>(
          apiRoutes.kassaReportTotal,
          queries
        ),
    });