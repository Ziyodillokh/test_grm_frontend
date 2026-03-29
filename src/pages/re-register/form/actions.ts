import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TData, TQuery } from "../type";

interface IData {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}

interface IMuteCheck {
  data: {
    bar_code:string,
    y:number
  }
}

export const useProdcutCheck = ({
  ...options
}: UseMutationOptions<object, Error, IMuteCheck, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data }) => {
      return await AddData(apiRoutes.productscheck, data);
    },
  });

export const useProductId = ({ options, id, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.qrBase, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.qrBase, id || "", queries),
  });

  export const useBarCodeById = ({ options, id, queries }: IData) =>
    useQuery({
      ...options,
      queryKey: [apiRoutes.qrBase + 'find-by', id],
      enabled: Boolean(id),
      queryFn: () =>
        getByIdData<TData, TQuery>(apiRoutes.qrBase+ '/find-by', id || "", queries),
    });
  
  
