import {
  DefinedInitialDataOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TChaFlowData, TData, TQuery } from "./type";
import { TKassareportData } from "../report-finance/type";

interface IKassaData {
  options?: DefinedInitialDataOptions<TResponse<TData>>;
  queries?: TQuery;
  enabled?: boolean;
}
interface IKassareportId {
  options?: DefinedInitialDataOptions<TKassareportData>;
  queries?: TQuery;
  id?: string;
  enabled: boolean;
}

interface ICashflowFilial {
  enabled: boolean;
  id: string | undefined;
}

export const useDataKassa = ({ queries, enabled }: IKassaData) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.kassa, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.kassa, {
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

export const useKassaReportSingle = ({
  options,
  id,
  queries,
  enabled,
}: IKassareportId) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.kassaReports, queries],
    enabled,
    queryFn: () =>
      getByIdData<TKassareportData, TQuery>(
        apiRoutes.kassaReports,
        id || "",
        queries
      ),
  });

export const useCashflowFilial = ({ enabled, id }: ICashflowFilial) =>
  useQuery({
    queryKey: [apiRoutes.cashflowFilial],
    enabled,
    queryFn: () =>
      getByIdData<TChaFlowData, TQuery>(apiRoutes.cashflowFilial, id || ""),
  });
