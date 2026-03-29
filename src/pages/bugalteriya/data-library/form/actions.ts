import {
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

import { AddData, UpdatePatchData } from "@/service/apiHelpers";

import { CropFormType } from "./schema";


interface IMute {
  url:string;
  data: CropFormType;
  id: string | undefined;
}

export const useDataLibrary = ({
  ...options
}: UseMutationOptions<object, Error, IMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ url,data, id }) => {
      const costomData: object = {
        ...data,
        collection:data?.collection?.value,
        country:data?.country?.value,
        factory:data?.factory?.value,
        // country:data?.country?.value,
      };
      if (id)
        return await UpdatePatchData<CropFormType>(url, id,  url == "/partiya-number" ? {title: data?.title+ "-partiya"}:costomData as CropFormType);
      return await AddData<CropFormType>(url, url == "/partiya-number" ? {title: data?.title+ "-partiya"}:costomData as CropFormType);
    },
  });