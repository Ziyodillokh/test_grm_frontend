import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { ProductsData, ProductsQuery } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductsData>>;
  queries?: ProductsQuery;
  filialId?: string;
  enabled?: boolean;
}

const useDataFetch = ({ options, queries, filialId, enabled = true }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    enabled: enabled,
    queryKey: [apiRoutes.collection, queries, filialId],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<ProductsData>, ProductsQuery>(apiRoutes.collection, {
        ...queries,
        page: pageParam as number,
        limit: 10,
        filialId: filialId,
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
