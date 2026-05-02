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
    queryKey: [apiRoutes.kassa + "/report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.kassa + "/report", {
        ...queries,
        page: pageParam as number,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      const cur = lastPage?.meta?.currentPage ?? 0;
      const total = lastPage?.meta?.totalPages ?? 0;
      return cur < total ? cur + 1 : null;
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