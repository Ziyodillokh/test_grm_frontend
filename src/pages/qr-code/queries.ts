import { 
  useInfiniteQuery, 
  useMutation, 
  useQueryClient 
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllData, AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";
import api from "@/service/fetchInstance";

import { QRCode, QRGeneratorQuery } from "./type";

const API_ENDPOINT = apiRoutes.qrCodes;

// Enhanced hook to fetch QR codes with infinite scrolling
export const useQRCodesFetch = (queries: QRGeneratorQuery) => {
  return useInfiniteQuery({
    queryKey: ["qr-codes", queries],
    queryFn: ({ pageParam = 1 }) => getAllData<TResponse<QRCode>, QRGeneratorQuery>(
      API_ENDPOINT,
      {
        ...queries,
        limit: queries.limit || 10, // Match API default
        page: pageParam as number,
      }
    ),
    getNextPageParam: (lastPage) => {
      // Check if there are more pages based on the meta information
      if (lastPage.meta?.currentPage < lastPage.meta?.totalPages) {
        return lastPage.meta?.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

// Hook to generate new QR codes
export const useGenerateQRCodes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (count: number) => {
      return AddData(API_ENDPOINT, { count });
    },
    onSuccess: () => {
      // Invalidate and refetch QR codes queries after successful generation
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      toast.success(`QR-коды успешно сгенерированы`);
    },
    onError: (error) => {
      toast.error("Ошибка при генерации QR-кодов");
      console.error("Error generating QR codes:", error);
    }
  });
};

// Hook to clear QR codes
export const useClearQRCodes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return api.patch(`${API_ENDPOINT}/clear`);
    },
    onSuccess: () => {
      // Invalidate and refetch QR codes queries after successful clear
      queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      toast.success("QR-коды успешно очищены");
    },
    onError: (error) => {
      toast.error("Ошибка при очистке QR-кодов");
      console.error("Error clearing QR codes:", error);
    }
  });
};