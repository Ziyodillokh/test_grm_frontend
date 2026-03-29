import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TransferData, TransferQuery } from "../type";
interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TransferData>>;
  queries?: TransferQuery;
}

const useDataFetch = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.packageTransfer, queries],
    queryFn: ({ pageParam = 1}) =>
      getAllData<TResponse<TransferData>, TransferQuery>(apiRoutes.packageTransfer, {
        ...queries,
        page: pageParam as number,
        limit: 10,
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
