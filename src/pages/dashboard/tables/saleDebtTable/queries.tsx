import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { ITotal, TData, TQuery } from "./type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData> & ITotal>;
  queries?: TQuery;
}

const useDataFetch = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.reportsHomePageCurrentMonthSellDebt, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TData>  & ITotal, TQuery>(apiRoutes.reportsHomePageCurrentMonthSellDebt, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit|| 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

export default useDataFetch;
