import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TData, TQuery } from "../type";

interface IData {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}

interface IMuteCheck {
  data: {
    code:string,
    y:number,
    tip:string| undefined,
  }
  isMetric:boolean,
  isUpdate:boolean,
  partiyaId:string
}

export const useProdcutCheck = ({
  ...options
}: UseMutationOptions<object, Error, IMuteCheck, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ partiyaId, data, isMetric, isUpdate }) => {
      if(isUpdate){
        return await UpdateData(apiRoutes.excelSingle, partiyaId,  
          data?.tip == "переучет" ?{
          check_count:data?.y
        }: {
          count:isMetric? undefined: data?.y,
          y:isMetric? (data?.y / 100): undefined,
        });
      }else{
        return await AddData(apiRoutes.excelProduct + "/" + partiyaId, data);
      }
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
  
  
