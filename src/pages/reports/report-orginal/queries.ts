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

export const useDataFetch =({ options, queries,enabled=true }: ITransfers) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.reportsMonthlyV2,queries],
    enabled:enabled,
    queryFn: () =>
      getAllData<TData, TQuery>(apiRoutes.reportsMonthlyV2, queries),
  });

