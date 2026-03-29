import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "../type";
import { UserFormType } from "./schema";

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface IUsers {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}
interface IUsersMute {
  data: UserFormType;
  id: string | undefined;
}

export const useUserMutation = ({
  ...options
}: UseMutationOptions<AuthResponse, Error, IUsersMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
        position: data?.position?.value,
        filial: data?.filial?.value,
        avatar: data?.avatar?.id,
      };
      if (id)
        return await UpdatePatchData<UserFormType>(
          apiRoutes.user,
          id,
          costomData as UserFormType
        );
      return await AddData<UserFormType>(
        apiRoutes.user,
        costomData as UserFormType
      );
    },
  });

export const useUserById = ({ options, id, queries }: IUsers) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.user, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.user, id || "", queries),
  });
