import { FileCheck, FileOutput, Loader, XCircle } from "lucide-react";
import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useQueryState } from "nuqs";

/**
 * F-manager / M-manager filter bar.
 * Status flow (new): OPEN → CLOSED (F-manager) → ACCEPTED (M-manager)
 */
export default function Filters() {
  const [reportStatus, setReportStatus] = useQueryState("reportStatus");
  const { filialReportId } = useParams();
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReport] });
    queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReportTotals] });
  };

  // OPEN → CLOSED (F-manager)
  const { mutate: submitForAcceptance, isPending: submitting } = useMutation({
    mutationFn: () => AddData(`${apiRoutes.filialReport}/${filialReportId}/close`, {}),
    onSuccess: () => {
      toast.success("Tasdiqlashga yuborildi");
      setReportStatus("closed");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Xatolik"),
  });

  // CLOSED → ACCEPTED (M-manager)
  const { mutate: acceptReport, isPending: accepting } = useMutation({
    mutationFn: () => AddData(`${apiRoutes.filialReport}/${filialReportId}/accept`, {}),
    onSuccess: () => {
      toast.success("Qayta ro'yxat tasdiqlandi");
      setReportStatus("accepted");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Xatolik"),
  });

  // CLOSED → OPEN (M-manager reject)
  const { mutate: rejectReport, isPending: rejecting } = useMutation({
    mutationFn: () => AddData(`${apiRoutes.filialReport}/${filialReportId}/reject`, {}),
    onSuccess: () => {
      toast.success("Rad etildi — qayta scan mumkin");
      setReportStatus("open");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Xatolik"),
  });

  const isMmanager = meUser?.position?.role == 9;
  const isFmanager = meUser?.position?.role == 4 || meUser?.position?.role == 7;

  return (
    <div className="bg-sidebar border-border border-b h-[64px]   flex  ">
      <SearchInput className="border-border border-r" />
      <FilterSelect
        className="border-border max-w-[150px] w-full border-r"
        options={[
          { label: "Остатка", value: "new" },
          { label: "Переучёт", value: "recount" },
          { label: "Розница", value: "surplus" },
        ]}
        defaultValue={isFmanager ? "recount" : "new"}
        placeholder="Накладной"
        name="tip"
      />

      {isMmanager ? (
        <div className="ml-auto flex items-center gap-2 pr-2">
          {reportStatus === "closed" && (
            <>
              <Button
                onClick={() => acceptReport()}
                disabled={accepting || rejecting}
                variant="default"
                className="h-full border-y-0"
              >
                {accepting ? <Loader className="animate-spin mr-2" /> : <FileCheck className="mr-2" />}
                Tasdiqlash
              </Button>
              <Button
                onClick={() => rejectReport()}
                disabled={accepting || rejecting}
                variant="destructive"
                className="h-full border-y-0"
              >
                {rejecting ? <Loader className="animate-spin mr-2" /> : <XCircle className="mr-2" />}
                Rad etish
              </Button>
            </>
          )}
          {reportStatus === "accepted" && (
            <span className="text-[13px] text-muted-foreground">Tasdiqlangan</span>
          )}
          {reportStatus === "open" && (
            <span className="text-[13px] text-muted-foreground">F-manager yakunlashini kuting</span>
          )}
        </div>
      ) : (
        <Button
          onClick={() => reportStatus === "open" && submitForAcceptance()}
          disabled={reportStatus !== "open" || submitting}
          className="h-full ml-auto  border-y-0"
          variant={reportStatus !== "open" ? "outline" : "default"}
        >
          {submitting ? <Loader className="animate-spin" /> : <FileOutput />}
          {reportStatus === "open" && "Tasdiqlashga yuborish"}
          {reportStatus === "closed" && "Tasdiqlash kutilmoqda"}
          {reportStatus === "accepted" && "Tasdiqlangan"}
        </Button>
      )}
    </div>
  );
}
