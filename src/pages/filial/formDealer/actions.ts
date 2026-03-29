import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { FilialsQuery, TData } from "../type";
import { FilialFormType } from "./schema";

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface IFilials {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: FilialsQuery;
}
interface IFilialsMute {
  data: FilialFormType;
  id: string | undefined;
}

export const useDealerMutation = ({
  ...options
}: UseMutationOptions<AuthResponse, Error, IFilialsMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      if (id) {
        delete data["type"];
      }
      if (id)
        return await UpdatePatchData<FilialFormType>(
          apiRoutes.dealer,
          id,
          data
        );
      return await AddData<FilialFormType>(apiRoutes.dealer, data);
    },
  });

export const useFilialById = ({ options, id, queries }: IFilials) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.filial, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, FilialsQuery>(apiRoutes.filial, id || "", queries),
  });
