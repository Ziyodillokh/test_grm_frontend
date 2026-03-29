import {
  DefinedInitialDataOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { TQuery } from "@/pages/employees/type";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { TResponse } from "@/types";

import { KassaItem, KassaReportData, TransactionItem } from "./type";

// Query hook to fetch kassa report
export const useKassaReport = () => {
  const { meUser } = useMeStore();
  const filialId = meUser?.filial?.id;

  return useQuery({
    queryKey: [apiRoutes.kassaReport],
    queryFn: () => getAllData<KassaReportData, void>(apiRoutes.kassaReport),
    enabled: !!filialId,
  });
};
interface IData {
  options?: DefinedInitialDataOptions<TResponse<TransactionItem>>;
  queries?: TQuery;
  enabled?: boolean
}
interface IKassaData {
  options?: DefinedInitialDataOptions<TResponse<KassaItem>>;
  queries?: TQuery;
  enabled?: boolean
}
export const useDataCashflow = ({ queries ,enabled}: IData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.cashflow, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TransactionItem>, TQuery>(apiRoutes.cashflow, {
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
    enabled: enabled,
    initialPageParam: 1,
  });

export const useDataKassa = ({ queries ,enabled =true}: IKassaData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.kassa, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<KassaItem>, TQuery>(apiRoutes.kassa, {
        ...queries,
        page: pageParam as number,
        limit: 30,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    enabled: enabled,
    initialPageParam: 1,
  });
  

interface TQueries {
  filial: string;
  status: string;
}
export const useReport = ({ queries }: { queries: TQueries }) => {
  return useQuery({
    queryKey: [apiRoutes.kassa, queries],
    queryFn: () =>
      getAllData<KassaReportData, TQueries>(apiRoutes.kassa, queries),
  });
};
