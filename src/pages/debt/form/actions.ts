import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "../type";
import { ClientFormType } from "./schema";



interface IClients {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}
interface IClientsMute {
  data: ClientFormType;
  id: string | undefined;
}

export const useClientMutation = ({
  ...options
}: UseMutationOptions<object, Error, IClientsMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
      };
      if (id)
        return await UpdatePatchData<ClientFormType>(
          apiRoutes.debt,
          id,
          costomData as ClientFormType
        );
      return await AddData<ClientFormType>(
        apiRoutes.debt,
        costomData as ClientFormType
      );
    },
  });

export const useClientById = ({ options, id, queries }: IClients) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.debt, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.debt, id || "", queries),
  });
