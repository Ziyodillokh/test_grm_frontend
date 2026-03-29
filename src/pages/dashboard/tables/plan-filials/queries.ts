import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { ITotal, TData, TQuery } from "./type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData> & ITotal>;
  queries?: TQuery;
  year?: string;
}

const useDataFetch = ({ options, queries, year }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.filialPlan, queries, year],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<TData> & ITotal, TQuery>(apiRoutes.filialPlan + "/" + year, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
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

interface IPlanSellers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData> & ITotal>;
  queries?: TQuery;
  year?: string | number | null;
  filialId?: string | null;
}

export const usePlanSellersFetch = ({ options, queries, year, filialId }: IPlanSellers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.filialPlan, "by-filial", queries, year, filialId],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData> & ITotal, TQuery>(
        `${apiRoutes.filialPlan}/by-filial/${filialId}`,
        {
          ...queries,
          year: Number(year),
          page: pageParam as number,
          limit: queries?.limit || 10,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
    enabled: !!filialId,
  });
