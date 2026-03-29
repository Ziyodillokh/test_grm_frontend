import {
    DefinedInitialDataInfiniteOptions,
    DefinedInitialDataOptions,
    useInfiniteQuery,
    useQuery,
  } from "@tanstack/react-query";
  
  import { getAllData } from "@/service/apiHelpers";
  import { apiRoutes } from "@/service/apiRoutes";
  import { TResponse } from "@/types";
  
  import { ITotal, TData, TQuery } from "./type";
  
  interface ITransfers {
    options?: DefinedInitialDataInfiniteOptions<TResponse<TData> & ITotal>;
    queries?: TQuery;
  }

  interface IData1 {
    options?: DefinedInitialDataOptions<TData[]>;
    queries?: TQuery;
    enabled?: boolean;
    id:string | undefined
  }
  export const useDataCashflowTypes = ({ options, queries,enabled ,id}: IData1) =>
    useQuery({
      ...options,
      enabled,
      queryKey: [apiRoutes.cashflowTypesByManagers, queries],
      queryFn: () =>
        getAllData<TData[], TQuery>(apiRoutes.cashflowTypesByManagers +"/" +id, queries),
    });
  
  
  const useDataFetch = ({ options, queries }: ITransfers) =>
    useInfiniteQuery({
      ...options,
      queryKey: [apiRoutes.reportsHomePageCurrentMonthManagers, queries],
      queryFn: ({ pageParam = 10 }) =>
        getAllData<TResponse<TData>  & ITotal, TQuery>(apiRoutes.reportsHomePageCurrentMonthManagers, {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit|| 10,
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
  