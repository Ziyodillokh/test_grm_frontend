import { DefinedInitialDataOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import {  TKassareportData, TQuery } from "./type";

interface IKassaReportData {
  options?: DefinedInitialDataOptions<TResponse<TKassareportData>>;
  queries?: TQuery;
  enabled?: boolean
}

interface IreportsTotal {
  queries?: object;
  enabled?: boolean
}

export const useReports = ({ queries ,enabled}: IKassaReportData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.reports, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TKassareportData>, TQuery>(apiRoutes.reports, {
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


  export const useReportsTotal = ({ queries ,enabled}: IreportsTotal) =>
    useQuery({
      queryKey: [apiRoutes.reportsTotal,queries],
      queryFn: () =>
        getAllData<TKassareportData, object>(apiRoutes.reportsTotal ,queries),
      enabled
    });