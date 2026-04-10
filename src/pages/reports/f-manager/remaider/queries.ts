import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { InventoryResponse, PartiyaResponse, TQuery } from "./type";

interface IInventoryQuery {
  queries?: TQuery;
  enabled?: boolean;
}

export const useFilialSnapshot = ({ queries, enabled = true }: IInventoryQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.inventoryFilialSnapshot, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<InventoryResponse, TQuery>(apiRoutes.inventoryFilialSnapshot, {
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

export const useFilialList = ({ enabled = true }: { enabled?: boolean }) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.filialWarehouse],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filialWarehouse, { limit: 100, page: 1 }),
    getNextPageParam: () => null,
    enabled,
    initialPageParam: 1,
  });

export const usePartiyaSnapshot = ({ queries, enabled = true }: IInventoryQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.inventoryPartiyaSnapshot, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<PartiyaResponse, TQuery>(apiRoutes.inventoryPartiyaSnapshot, {
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
