import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TransferDealerData, TransferQuery } from "../type";
interface ITransferDealers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TransferDealerData>>;
  queries?: TransferQuery;
}

const useTransferDealersFetch = ({ options, queries }: ITransferDealers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.transferDealer, queries],
    queryFn: ({ pageParam = 1}) =>
      getAllData<TResponse<TransferDealerData>, TransferQuery>(apiRoutes.transferDealer, {
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

export default useTransferDealersFetch;
