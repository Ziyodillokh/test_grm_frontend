import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { DiscountFormType } from "./schema";
import { DiscountData } from "../type";



interface IDiscounts {
  options?: DefinedInitialDataOptions<DiscountData>;
  id: string | undefined;
}
interface IDiscountsMute {
  data: DiscountFormType;
  id: string | undefined;
}

export const useDiscountMutation = ({
  ...options
}: UseMutationOptions<object, Error, IDiscountsMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
      };
      if (id)
        return await UpdatePatchData<DiscountFormType>(
          apiRoutes.discount,
          id,
          costomData as DiscountFormType
        );
      return await AddData<DiscountFormType>(
        apiRoutes.discount,
        costomData as DiscountFormType
      );
    },
  });

export const useDiscountById = ({ options, id }: IDiscounts) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.discount, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<DiscountData, object>(apiRoutes.discount, id || ""),
  });
