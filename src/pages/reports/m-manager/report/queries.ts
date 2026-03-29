import {
  DefinedInitialDataOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";
import { TData, TQuery} from "./type";

interface IData {
  options?: DefinedInitialDataOptions<TResponse<TData>>;
  queries?: TQuery;
  enabled?: boolean
}

export const useDataCashflow = ({ queries ,enabled}: IData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.cashflow, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.cashflow, {
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


