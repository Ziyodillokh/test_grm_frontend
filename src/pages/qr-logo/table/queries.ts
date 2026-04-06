import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllData, UpdatePatchData } from "@/service/apiHelpers";
import { TResponse } from "@/types";

import { QrLogo, QrLogoQuery } from "../type";

const qrLogoUrl = "/qr-logo";

interface IQrLogoFetch {
  options?: DefinedInitialDataInfiniteOptions<TResponse<QrLogo>>;
  queries?: QrLogoQuery;
}

export const useQrLogoData = ({ options, queries }: IQrLogoFetch) =>
  useInfiniteQuery({
    ...options,
    queryKey: [qrLogoUrl, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<QrLogo>, QrLogoQuery>(qrLogoUrl, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 20,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      }
      return null;
    },
    initialPageParam: 1,
  });

export const useToggleQrLogoStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      UpdatePatchData(qrLogoUrl, id + "/toggle", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [qrLogoUrl] });
      toast.success("Статус изменен");
    },
    onError: () => {
      toast.error("Ошибка при изменении статуса");
    },
  });
};
