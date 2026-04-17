import {
  DefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "./type";

interface ITransfers {
  options?: DefinedInitialDataOptions<TData>;
  queries?: TQuery;
  enabled?: boolean;
}

export const useDataFetch = ({ options, queries, enabled = true }: ITransfers) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.reportsMonthlyV2, queries],
    enabled: enabled,
    queryFn: () =>
      getAllData<TData, TQuery>(apiRoutes.reportsMonthlyV2, queries),
  });

// Drill-in detail uchun query
type DetailQuery = {
  type: string;
  month?: number;
  year?: number;
  filialId?: string;
};

export const useReportDetail = (query: DetailQuery, enabled: boolean) =>
  useQuery({
    queryKey: [apiRoutes.reportsMonthlyV2Detail, query],
    enabled,
    queryFn: () =>
      getAllData<{ items: any[] }, DetailQuery>(
        apiRoutes.reportsMonthlyV2Detail,
        query,
      ),
  });

