import {  Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { UpdatePatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

export default function Filters({
  setSeleted,
}: {
  setSeleted: (ids: string[]) => void;
}) {
 

  const [kassaReports] = useQueryState("kassaReports");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      UpdatePatchData(apiRoutes.kassaReports, kassaReports || "", {}),
    onSuccess: () => {
      toast.success("close");
      setSeleted([]);
    },
    onError: (error) => {
      toast.error(error?.message);
      setSeleted([]);
    },
  })

  return (
    <div className="px-[20px] h-[64px] items-center mb-2 flex justlfe">
         <p className="text-[#272727] text-[20px] m-4 mr-auto ">Ежемесячный отчет  </p>
      {/* <Button
        className="h-full  border-y-0 w-[140px]  ml-auto"
        variant={"outline"}
      >
        <FileOutput /> Экспорт
      </Button> */}
      {kassaReports && (
        <Button
          onClick={() => mutate()}
          disabled={isPending}
          className="h-full  rounded-xl  hover:bg-[#525248]  ml-auto    w-[165px]  "
        >
          {isPending ? <Loader2 /> : <X />}
          Закрыть кассу
        </Button>
      )}
    </div>
  );
}
