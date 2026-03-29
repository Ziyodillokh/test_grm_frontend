
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {  getByIdData, PatchData } from "@/service/apiHelpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import AddingParishOrFlow from "@/components/adding-parish-flow";
import { useMeStore } from "@/store/me-store";
import { IOpenKassa } from "@/types/api-type";



export default function Pricecheck({disabled,id}:{disabled?:boolean,id:string}) {
  const { meUser } = useMeStore();
  const filialId = meUser?.filial.id;
  const { mutate, isPending } = useMutation({
    mutationFn: () => PatchData(apiRoutes.kassaClose, {
      ids:[id]
    }),
    onSuccess: () => {
      toast.success("close");
    },
  });
  const { data } = useQuery({
    queryKey: [apiRoutes.filial, filialId],
    queryFn: () =>
      getByIdData<IOpenKassa, void>("/kassa/open-kassa", filialId || ""),
    enabled: !!filialId,
  });
  return (
    <div className="w-full   bg-background  max-w-[312px] pb-[10px] pt-6 sticky top-0">
      <AddingParishOrFlow kassaId={String(data?.id)} />
      <div className="w-full mt-2">
      <Button 
        onClick={()=>mutate()}
        disabled={isPending || disabled}
        className="w-full py-10.5 p-10 bg-primary rounded-xl  text-background text-[22px] font-semibold">
          Закрыть кассу
        </Button>
      </div>
    </div>
  );
}
