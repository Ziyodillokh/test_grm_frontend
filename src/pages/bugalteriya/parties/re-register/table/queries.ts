import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TData, TQuery, TReportData } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
  enabled?:boolean
}
interface IPartiyaReport {
  options?: DefinedInitialDataInfiniteOptions<TReportData>;
  queries?: TQuery;
  enabled?:boolean
}

const useDataFetch = ({ options, queries,enabled=true }: ITransfers) =>
useInfiniteQuery({
  ...options,
  enabled,
  queryKey: [apiRoutes.excelProducts, queries],
  queryFn: ({ pageParam = 10 }) =>
    getAllData<TResponse<TData>, TQuery>(apiRoutes.excelProducts, {
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

export const usePartiyaReport = ({  queries,enabled=true }: IPartiyaReport) => useQuery({
    queryKey: [apiRoutes.excelProductsReport,queries],
    enabled,
    queryFn: () => getAllData<TReportData, TQuery>(apiRoutes.excelProductsReport,queries),
})

export default useDataFetch;
