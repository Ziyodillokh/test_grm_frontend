import {
  DefinedInitialDataOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { TQuery } from "@/pages/employees/type";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { KassaItem, TransactionItem } from "./types";

interface IData {
  options?: DefinedInitialDataOptions<TResponse<TransactionItem>>;
  queries?: TQuery;
  enabled?: boolean;
}
interface IKassaData {
  options?: DefinedInitialDataOptions<TResponse<KassaItem>>;
  queries?: TQuery;
  enabled?: boolean;
}

export const useDataCashflow = ({ queries, enabled }: IData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.cashflow, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TransactionItem>, TQuery>(apiRoutes.cashflow, {
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

export const useDataKassa = ({ queries, enabled = true }: IKassaData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.kassa, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<KassaItem>, TQuery>(apiRoutes.kassa, {
        ...queries,
        page: pageParam as number,
        limit: 30,
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
