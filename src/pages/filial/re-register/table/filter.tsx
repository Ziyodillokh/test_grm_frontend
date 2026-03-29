import { FileCheck, FileOutput, Loader } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [reportStatus, setReportStatus] = useQueryState("reportStatus");
  const { filialId } = useParams();
  const { meUser } = useMeStore();

  const StatusText = {
    open: "Отправить на подтверждение",
    accepted: "В ожидании...",
    closed: "Принято",
  };

  const StatusMManaerText = {
    open: "Принимается",
    accepted: "Принять переучёт",
    closed: "Принято",
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await UpdatePatchData(
        reportStatus == "open" ? apiRoutes.productAcceptReport : apiRoutes.productCloseReport,
        filialId == "my-filial" ? meUser?.filial?.id || "" : filialId || "",
        {}
      );
    },
    onSuccess: () => {
      toast.success(reportStatus == "open" ? "accepted" : "closed");
      setReportStatus(reportStatus == "open" ? "accepted" : "closed");
    },
  });
  return (
    <div className="bg-sidebar border-border border-b h-[64px]   flex  ">
      <SearchInput className="border-border border-r" />
      <FilterSelect
        className="border-border max-w-[150px] w-full border-r"
        options={[
          { label: "Остатка", value: "new" },
          { label: "Переучёт", value: "переучет" },
          { label: "Розница", value: "излишки" },
        ]}
        defaultValue={
          meUser?.position?.role == 7 || meUser?.position.role == 4
            ? "переучет"
            : "new"
        }
        placeholder="Накладной"
        name="tip"
      />
      {/* <FilterSelect
        className="border-border max-w-[150px] w-full border-r"
        options={[
          { label: "Коллекция", value: "collection" },
          { label: "Продукт", value: "default" },
        ]}
        defaultValue="default"
        placeholder="Коллекция"
        name="type"
      /> */}

      {meUser?.position?.role == 9 ? (
        <Button
          disabled={reportStatus != "accepted"}
          onClick={() => (reportStatus == "accepted" ? mutate() : {})}
          variant={"outline"}
          className="h-full ml-auto  border-y-0"
        >
          <FileCheck />
          {/* @ts-ignore */}
          {StatusMManaerText[reportStatus]}
        </Button>
      ) : (
        <Button
          onClick={() => (reportStatus == "open" ? mutate() : {})}
          disabled={
            reportStatus != "open" || isPending
          }
          className="h-full ml-auto  border-y-0"
          variant={reportStatus != "open" ? "outline" : "default"}
        >
          {isPending ? <Loader className="animate-spin" /> : <FileOutput />}
          {/* @ts-ignore */}
          {StatusText[reportStatus]}
        </Button>
      )}
    </div>
  );
}
