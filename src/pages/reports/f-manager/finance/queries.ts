import { DefinedInitialDataOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import {  TKassareportData, TQuery, TTotalDebt } from "./type";


interface IKassaReportData {
  options?: DefinedInitialDataOptions<TResponse<TKassareportData>>;
  queries?: TQuery;
  enabled?: boolean
}

interface IClientDebtTotal {
  options?: DefinedInitialDataOptions<TTotalDebt>;
  queries?: TQuery;
  enabled?: boolean
  id:string;
}

export const useKassaReports = ({ queries ,enabled}: IKassaReportData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.kassaReports, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TKassareportData>, TQuery>(apiRoutes.kassaReports, {
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

  export const useClientdebtTotal= ({ options, queries,enabled ,id}: IClientDebtTotal) =>
    useQuery({
      ...options,
      queryKey: [apiRoutes.clientDebtTotal,queries],
      enabled,
      queryFn: () =>
        getAllData<TTotalDebt, object>(
          apiRoutes.clientDebtTotal + "/" +id,
          queries
        ),
    });

