import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { DiscountData, DiscountQuery } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<DiscountData>>;
  queries?: DiscountQuery;
  enabled?: boolean;
}

const useDiscountDataFetch = ({ options, queries, enabled = true }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    enabled: enabled,
    queryKey: [apiRoutes.discount, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<DiscountData>, DiscountQuery>(apiRoutes.discount, {
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
    initialPageParam: 1,
  });

export default useDiscountDataFetch;
