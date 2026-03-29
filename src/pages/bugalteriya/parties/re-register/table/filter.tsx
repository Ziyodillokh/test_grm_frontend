import { FileCheck, FileOutput, Loader } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import FileExelUpload from "@/components/file-upload";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

export default function Filters({
  partiyaStatus = "new",
  check,
}: {
  partiyaStatus: string | undefined;
  check: boolean | undefined;
}) {
  const { id } = useParams();
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const [tip] = useQueryState("tip", parseAsString.withDefault((meUser?.position?.role ==7 || meUser?.position.role == 4) ? "переучет": "new"));

  const changeStatus = useMemo(() => {
    if (partiyaStatus == "new") {
      return "pending"; // panding by M-Manager(9) 
    } else if (partiyaStatus == "pending" && !check) {
      return "closed"; // close my w-manager(7)
    } else if (partiyaStatus == "closed" && check) {
      return "finished"; // finish after closing by M-Manager(9) 
    }
  }, [partiyaStatus]);

  const StatusText = {
    new: "Отправить на приходование",
    pending: "Принимается...",
    close: "Закрыть Партие",
    closed: "Закрыто",
  };

  const { mutate,isPending } = useMutation({
    mutationFn: async () => {
      return await UpdatePatchData(
        apiRoutes.partiesChanngeStatus,
        id + "/" + changeStatus,
        {}
      );
    },
    onSuccess: () => {
      toast.success("Partiya closed");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.parties] });
    },
  });
  return (
    <div className="bg-sidebar border-border border-b h-[64px]   flex  ">
      <SearchInput className="border-border border-r" />
      <FilterSelect
        className="border-border max-w-[150px] w-full border-r"
        options={[
          { label: "Накладной", value: "new" },
          { label: "Оприходован", value: "переучет" },
          { label: "Розница", value: "излишки" }, //дефицит
        ]}
        defaultValue={(meUser?.position?.role ==7 || meUser?.position.role == 4) ? "переучет":"new"}
        placeholder="Накладной"
        name="tip"
      />
      <FilterSelect
        className="border-border max-w-[150px] w-full border-r"
        options={[
          { label: "Коллекция", value: "collection" },
          { label: "Продукт", value: "default" },
        ]}
        defaultValue="default"
        placeholder="Коллекция"
        name="type"
      />
     { meUser?.position?.role == 9 && tip=="new" ? <FileExelUpload partiyaId={id || ""} />:""}

      {(meUser?.position?.role == 7 || meUser?.position.role == 4) ? (
        <Button
          onClick={() => mutate()}
          disabled={check || isPending}
          variant={check? "outline":"default"}
          className="h-full ml-auto  border-y-0  "
        >
          <FileCheck />
          {check? "Отправлено": "Подтвердить оприходование"}
        </Button>
      ) : (
        <Button
          onClick={() => mutate()}
          disabled={(partiyaStatus == "pending" && check) || isPending}
          className="h-full ml-auto  border-y-0"
          variant={(partiyaStatus == "new" || partiyaStatus == "closed")  ?"default": "outline"}
        >
        { isPending ? <Loader className="animate-spin"/> :  <FileOutput />}


          {/* @ts-ignore */}
          
          { StatusText[(check && partiyaStatus == "pending") ? "closed" : check ? "close"  : partiyaStatus]}
        </Button>
      )}
    </div>
  );
}
