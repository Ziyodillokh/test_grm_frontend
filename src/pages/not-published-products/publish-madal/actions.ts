import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { QrBaseFormType } from "./schema";
import { qrBaseIMarkerData } from "../type";



interface IQrBases {
  options?: DefinedInitialDataOptions<qrBaseIMarkerData>;
  id: string | undefined;
  queries?: object;
}
interface IQrBasesMute {
  data: QrBaseFormType;
  id: string | undefined;
}

export const useQrBaseMutation = ({
  ...options
}: UseMutationOptions<object, Error, IQrBasesMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        internetInfo: data?.internetInfo,
        imgUrl: data?.imgUrl?.id,
        status: data?.status,
        i_price: data?.i_price,
        sizeType: data?.sizeType?.value,
        // code: data?.code,
        country: data?.country?.value,
        collection: data?.collection?.value,
        factory: data?.factory?.value,
        size: data?.size?.value,
        shape: data?.shape?.value,
        style: data?.style?.value,
        color: data?.color?.value,
        model: data?.model?.value,
      };
      if (id)
        return await UpdateData<QrBaseFormType>(
          apiRoutes.qrBaseInternet,
          id,
          costomData as QrBaseFormType
        );
      return await AddData<QrBaseFormType>(
        apiRoutes.qrBaseInternet,
        costomData as QrBaseFormType
      );
    },
  });

export const useQrBaseById = ({ options, id, queries }: IQrBases) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.qrBase, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<qrBaseIMarkerData, object>(apiRoutes.qrBase, id || "", queries),
  });
