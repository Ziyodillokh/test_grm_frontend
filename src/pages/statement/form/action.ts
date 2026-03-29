import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({id,status}:{id:string,status:string}) => {
        return  UpdatePatchData(apiRoutes.payrollsChangeStatus, id + "/" +  status,{
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [apiRoutes.payrolls] });
        toast.success("Статус успешно изменен");
      },
      onError: (error) => {
        toast.error("Ошибка при очистке QR-кодов");
        console.error("Error clearing QR codes:", error);
      }
    });
  };