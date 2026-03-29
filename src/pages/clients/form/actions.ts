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
          apiRoutes.clients,
          id,
          costomData as ClientFormType
        );
      return await AddData<ClientFormType>(
        apiRoutes.clients,
        costomData as ClientFormType
      );
    },
  });

export const useClientById = ({ options, id, queries }: IClients) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.clients, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.clients, id || "", queries),
  });
