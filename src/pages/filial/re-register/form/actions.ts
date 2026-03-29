import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TData, TQuery } from "../type";
import { CropFormType } from "./schema";

interface IData {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}

interface IMuteCheck {
  data:CropFormType
  isUpdate:boolean,
  id:string 
}

export const useProdcutCheck = ({
  ...options
}: UseMutationOptions<object, Error, IMuteCheck, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({  data,id, isUpdate }) => {
      const costomData: object = {
        code:data?.code,
        filialReportId: data?.filialReportId,
        filialId: data?.filialId,
        value:data?.value,
        ...(isUpdate && { id }),
        countryId: data?.country?.value,
        collectionId :data?.collection?.value,
        sizeId: data?.size?.value,
        shapeId:data?.shape?.value,
        styleId:data?.style?.value,
        colorId:data?.color?.value,
        modelId:data?.model?.value,
        factoryId:data?.factory?.value,
        isMetric:data?.isMetric?.value === "true" ? true : false,
      };
      
        return await AddData(apiRoutes.reInventoryProcess  , costomData);
      
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
  
  
