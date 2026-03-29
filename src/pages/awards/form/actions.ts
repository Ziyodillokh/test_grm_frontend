import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "../type";
import { AwardsFormType } from "./schema";

interface IAwardss {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}
interface IAwardssMute {
  data: AwardsFormType;
  id: string | undefined;
}

export const useAwardsMutation = ({
  ...options
}: UseMutationOptions<object, Error, IAwardssMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
      };
      if (id)
        return await UpdatePatchData<AwardsFormType>(
          apiRoutes.awards,
          id,
          costomData as AwardsFormType
        );
      return await AddData<AwardsFormType>(
        apiRoutes.awards,
        costomData as AwardsFormType
      );
    },
  });

export const useAwardsById = ({ options, id, queries }: IAwardss) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.awards, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.awards, id || "", queries),
  });
