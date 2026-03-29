import { DefinedInitialDataOptions, useInfiniteQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TData, TQuery, TTopData } from "./type";

interface ISellerCashflowData {
  options?: DefinedInitialDataOptions<TResponse<TData> & { totals: TTopData }>;
  queries?: TQuery;
  enabled?: boolean
}



export const useDataSellerCashflow = ({ queries, enabled }: ISellerCashflowData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.cashflow, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData> & { totals: TTopData }, TQuery>(apiRoutes.cashflow, {
        ...queries,
        page: pageParam as number,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage;
      } else {
        return null;
      }
    },
    enabled: enabled,
    initialPageParam: 1,
  });