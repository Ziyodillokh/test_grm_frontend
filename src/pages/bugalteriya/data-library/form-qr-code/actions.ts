import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TData, TQuery } from "../type";
import { CropFormType } from "./schema";

interface IData {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}
interface IMute {
  data: CropFormType;
  id: string | undefined;
}


export const useDataLibrary = ({
  ...options
}: UseMutationOptions<object, Error, IMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
        country: data?.country?.value,
        collection: data?.collection?.value,
        size: data?.size?.value,
        shape:data?.shape?.value,
        style:data?.style?.value,
        color:data?.color?.value,
        model:data?.model?.value,
        factory:data?.factory?.value,
        isMetric:data?.isMetric?.value === "true" ? true : false,
      };
      if (id) {
        const dataToUpdate = { ...costomData } as Record<string, any>;
        delete dataToUpdate.code;
        return await UpdateData<CropFormType>(apiRoutes.qrBase, id, dataToUpdate as CropFormType);
      } else {
        return await AddData<CropFormType>(apiRoutes.qrBase, costomData as CropFormType);
      }
        
    },
  });

export const useDataLibraryId = ({ options, id, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.qrBase, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.qrBase, id || "", queries),
  });
