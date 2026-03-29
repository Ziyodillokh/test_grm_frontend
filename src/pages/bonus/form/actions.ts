import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "../type";
import { BonusFormType } from "./schema";



interface IBonuss {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}
interface IBonussMute {
  data: BonusFormType;
  id: string | undefined;
}

export const useBonusMutation = ({
  ...options
}: UseMutationOptions<object, Error, IBonussMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
      };
      if (id)
        return await UpdatePatchData<BonusFormType>(
          apiRoutes.bonus,
          id,
          costomData as BonusFormType
        );
      return await AddData<BonusFormType>(
        apiRoutes.bonus,
        costomData as BonusFormType
      );
    },
  });

export const useBonusById = ({ options, id, queries }: IBonuss) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.bonus, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.bonus, id || "", queries),
  });
