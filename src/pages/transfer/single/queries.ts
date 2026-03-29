import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { ProductData, ProductDataOrder, TQuery } from "@/pages/filial/type";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductData>>;
  queries?: TQuery;
}

interface ITransfersOrder {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductDataOrder>>;
  queries?: TQuery;
}

const useDataFetch = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.products, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<ProductData>, TQuery>(apiRoutes.products, {
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

  export const useDataOrderFetch = ({ options, queries }: ITransfersOrder) =>
    useInfiniteQuery({
      ...options,
      queryKey: [apiRoutes.orderBusket, queries],
      queryFn: ({ pageParam = 10 }) =>
        getAllData<TResponse<ProductDataOrder>, TQuery>(apiRoutes.orderBusket, {
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

export default useDataFetch;
