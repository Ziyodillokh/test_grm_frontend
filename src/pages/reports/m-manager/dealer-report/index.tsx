import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Loader, Plus } from "lucide-react";

import { CashflowList } from "@/components/cashflow-list";
import ReportToolbar from "@/components/report-toolbar";
import ReportTotals from "../../d-manager/report-finance/report-totals";
import AddingParishOrFlow from "@/components/adding-parish-flow";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useDataCashflow } from "./queries";
import { useKassaReportSingle } from "@/pages/report/table/queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useMeStore } from "@/store/me-store";

export default function DealerReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isDManager = role === 6;

  const { data: kassaReport } = useKassaReportSingle({
    id,
    enabled: Boolean(id),
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: { kassaId: id, limit: 10, page: 1 },
      enabled: Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page: any) => page?.items || []) || [];

  useEffect(() => {
    const title =
      (kassaReport as any)?.filial?.title ||
      (kassaReport as any)?.filial?.name ||
      "Kassa";
    if (title) push(title, location.pathname);
  }, [kassaReport, location.pathname]);

  const kassaStatus = (kassaReport as any)?.status as string | undefined;
  const isOpenOrWarning =
    kassaStatus === "open" || kassaStatus === "Open" || kassaStatus === "warning";
  const isDealerKassa = (kassaReport as any)?.filialType === "dealer";
  const showAddIncome = isDManager && isOpenOrWarning && isDealerKassa;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar + + Kirim button */}
      <div className="flex items-center gap-[4px] mb-[10px]">
        <ReportToolbar />
        {showAddIncome && id && (
          <div className="ml-auto">
            <KirimButton kassaId={id} />
          </div>
        )}
      </div>

      <ReportTotals data={kassaReport as any} />

      {/* Cashflow rows — reusable component */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom mt-[10px]">
        <CashflowList items={flatData} isLoading={isLoading} gap={10} />
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-3">
            <Loader className="w-4 h-4 animate-spin text-[#a3a3a3]" />
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="text-[12px] text-[#0078D4] py-2 hover:underline"
          >
            Yana ko'rsatish
          </button>
        )}
      </div>
    </div>
  );
}

function KirimButton({ kassaId }: { kassaId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-[42px] px-[20px] rounded-sm bg-[#48B533] hover:bg-[#3da02b] text-white text-[14px] font-medium flex items-center gap-[6px]">
          <Plus className="w-4 h-4" />
          Kirim
        </Button>
      </DialogTrigger>
      <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-sm">
        <AddingParishOrFlow kassaId={kassaId} />
      </DialogContent>
    </Dialog>
  );
}
