import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { PartiyaIdQuery, TSingleData } from "../type";
import { PartiyaFormType } from "./schema";

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface IPartiyas {
  options?: DefinedInitialDataOptions<TSingleData>;
  id: string | undefined;
  queries?: PartiyaIdQuery;
}
interface IPartiyasMute {
  data: PartiyaFormType;
  id: string | undefined;
}

export const usePartiyaMutation = ({
  ...options
}: UseMutationOptions<AuthResponse, Error, IPartiyasMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: any = {
        ...data,
        country: data.country?.value,
        factory: data.factory?.value,
        partiya_no: data.partiya_no?.value,
        warehouse: data.warehouse?.value,
        user: data.user?.value,
      }
      if (id)
        return await UpdatePatchData<PartiyaFormType>(apiRoutes.parties, id, costomData);
      return await AddData<PartiyaFormType>(apiRoutes.parties, costomData);
    },
  });

export const usePartiyaById = ({ options, id, queries }: IPartiyas) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.parties, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TSingleData, PartiyaIdQuery>(apiRoutes.parties, id || "", queries),
  });
