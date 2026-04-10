import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { SalesResponse, SalesPartiyaResponse, SalesQuery } from "./type";

interface ISalesQuery {
  queries?: SalesQuery;
  enabled?: boolean;
}

export const useSalesFilial = ({ queries, enabled = true }: ISalesQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.salesFilial, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<SalesResponse, SalesQuery>(apiRoutes.salesFilial, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useSalesDealer = ({ queries, enabled = true }: ISalesQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.salesDealer, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<SalesResponse, SalesQuery>(apiRoutes.salesDealer, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useSalesInternet = ({ queries, enabled = true }: ISalesQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.salesInternet, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<SalesResponse, SalesQuery>(apiRoutes.salesInternet, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

export const useSalesPartiya = ({ queries, enabled = true }: ISalesQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.salesPartiya, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<SalesPartiyaResponse, SalesQuery>(apiRoutes.salesPartiya, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta?.pagination || {};
      if (page < totalPages) return page + 1;
      return null;
    },
    enabled,
    initialPageParam: 1,
  });
