import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiRoutes } from "@/service/apiRoutes";
import { DeleteData } from "@/service/apiHelpers";

export const useDeleteStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return DeleteData(apiRoutes.payrolls, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.payrolls] });
      toast.success("Ведомость успешно удалена");
    },
  
  });
}; 