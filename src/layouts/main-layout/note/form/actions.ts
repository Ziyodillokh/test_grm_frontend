import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { TData, TQuery } from "../types";
import { FormDataType } from "./schema";


interface IData {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: TQuery;
}

export const useDataAdd = ({
  ...options
}: UseMutationOptions<object, Error, FormDataType, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async (data ) => {
      return await AddData(apiRoutes.notes, {content:"tets", ...data});
    },
  });

export const useDataId = ({ options, id, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.notes, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, TQuery>(apiRoutes.notes, id || "", queries),
  });
