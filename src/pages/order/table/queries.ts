import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TData, TQuery } from "../type";

interface ITransfers {
  options?: DefinedInitialDataInfiniteOptions<TResponse<TData>>;
  queries?: TQuery;
}

const useDataFetch = ({ options, queries }: ITransfers) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.clientOrders, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.clientOrders, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });




export default useDataFetch;

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UpdateData, getByIdData } from "@/service/apiHelpers";
import { IOrderItemsResponse } from "../type";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TData> }) =>
      UpdateData(apiRoutes.clientOrders, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clientOrders] });
    },
  });
};

export const useGetOrderById = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: [apiRoutes.clientOrders, id],
    queryFn: () => getByIdData<TData, any>(apiRoutes.clientOrders, id!),
    enabled: !!id,
  });

export const useGetOrderItems = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: [apiRoutes.clientOrderItems, id],
    queryFn: () => getByIdData<IOrderItemsResponse, any>(apiRoutes.clientOrderItems, id!),
    enabled: !!id,
  });
