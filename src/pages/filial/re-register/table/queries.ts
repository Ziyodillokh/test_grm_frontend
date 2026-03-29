import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import {  getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TData, TQuery, TReportData } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
  enabled?:boolean;
  id:string;
}
interface IPartiyaReport {
  options?: DefinedInitialDataInfiniteOptions<TReportData>;
  queries?: TQuery;
  enabled?:boolean;
  id:string;
}

const useDataFetch = ({ options,id, queries,enabled=true }: ITransfers) =>
useInfiniteQuery({
  ...options,
  enabled,
  queryKey: [apiRoutes.reInventoryGetByFilialReport, id,queries],
  queryFn: ({ pageParam = 10 }) =>
    getByIdData<TResponse<TData>, TQuery>(apiRoutes.reInventoryGetByFilialReport,id, {
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
})

export const usePartiyaReport = ({  queries,id,enabled=true }: IPartiyaReport) => useQuery({
    queryKey: [apiRoutes.reInventoryGetByFilialReportTotals,id,queries],
    enabled,
    queryFn: () => getByIdData<TReportData, TQuery>(apiRoutes.reInventoryGetByFilialReportTotals,id, {
      ...queries,
      page:1,
      limit: 10,
    }),
})

export default useDataFetch;
