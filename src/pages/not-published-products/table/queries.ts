import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { qrBaseIMarkerData,qrBaseIMarkerQuery } from "../type";

interface IqrBaseIMarker {
  options?: DefinedInitialDataInfiniteOptions<TResponse<qrBaseIMarkerData>>;
  queries?: qrBaseIMarkerQuery;
  role?: number;
}


const useDataFetch = ({ options, queries }: IqrBaseIMarker) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.qrBaseIMarker, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<qrBaseIMarkerData>, qrBaseIMarkerQuery>(
        apiRoutes.qrBaseIMarker,
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
