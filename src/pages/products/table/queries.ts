import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { ProductsData, ProductsQuery, CollectionData } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductsData>>;
  queries?: ProductsQuery;
  role?: number;
  
}

export const useCollectionDataFetch = ({url,search, filialId,country,endDate,startDate,enabled=true }:ProductsQuery) =>
  useInfiniteQuery({
    queryKey: [url, filialId,country,endDate,startDate,search ],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<CollectionData>, ProductsQuery>(
        `${url? url: apiRoutes.collectionProducts}`,
        {
          filial: filialId,
          country,
          page: pageParam as number,
          endDate,
          startDate,
          limit: 50,
          search,
        }
      ),
    enabled:enabled,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useDataFetch = ({ options, queries, role }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [role == 8 ? apiRoutes.productsIManager : apiRoutes.products, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<ProductsData>, ProductsQuery>(
        role == 8 ? apiRoutes.productsIManager : apiRoutes.products,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      ),
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
