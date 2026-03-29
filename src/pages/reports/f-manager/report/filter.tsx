import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { Button } from "@/components/ui/button";
import { MonthsArray } from "@/consts";
import { PatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Filters({ status,month }: { status: string,month?:number  }) {
  const { id } = useParams();
  // const item = row.original;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => PatchData(apiRoutes.kassaReports + "/" + id, {}),
    onSuccess: () => {
      toast.success("Closed");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
    },
  });
  return (
    <div className=" px-[20px] h-[64px] items-center  flex gap-2 mb-2 ">
      <p className="text-[#272727] text-[20px] mr-auto">Ежемесячный отчет | {month &&  MonthsArray[(month ||1)-1].label}</p>
      <DateRangePicker fromPlaceholder={`от`} toPlaceholder={`до`} />
    
      {id && (status == "open" || status == "rejected") ? (
        <Button
          disabled={isPending}
          onClick={() => mutate()}
          className="h-full  w-[165px]  "
          variant={"secondary"}
        >
          {/* <X />  */}
          {isPending ? <Loader className="animate-spin" /> : ""}
          Закрыть месяц
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
