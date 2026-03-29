import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { qrBaseIMarkerData, qrBaseIMarkerQuery, ProductsQuery, CollectionData } from "../type";

interface IqrBaseIMarker {
  options?: DefinedInitialDataInfiniteOptions<TResponse<qrBaseIMarkerData>>;
  queries?: qrBaseIMarkerQuery;
  role?: number;
}

export const useCollectionDataFetch = ({ url, search, filialId, country, endDate, startDate, enabled = true }: ProductsQuery) =>
  useInfiniteQuery({
    queryKey: [url, filialId, country, endDate, startDate, search],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<CollectionData>, ProductsQuery>(
        `${url ? url : apiRoutes.collectionProducts}`,
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
    enabled: enabled,
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

const useDataFetch = ({ options, queries }: IqrBaseIMarker) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.qrBaseIMarker, queries],
    queryFn: ({ pageParam = 20 }) =>
      getAllData<TResponse<qrBaseIMarkerData>, qrBaseIMarkerQuery>(
        apiRoutes.qrBaseIMarker,
        {
          ...queries,
          page: pageParam as number,
          limit: 20,
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
