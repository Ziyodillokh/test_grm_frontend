import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { ListRow } from "@/components/ui/list-row";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import ReportToolbar from "@/components/report-toolbar";
import { apiRoutes } from "@/service/apiRoutes";

import {
  useReInventoryItems,
  useReInventoryTotals,
  useFilialReportOne,
  useCloseFilialReport,
} from "@/pages/reports/m-manager/reports-hub/re-inventory/queries";
import EditProductDialog from "@/pages/reports/m-manager/reports-hub/re-inventory/edit-product-dialog";
import ActionPageQrCode from "./form";

const tabs = [
  { key: "переучет", label: "Qayta ro'yxat" },
  { key: undefined, label: "Qoldiq" },
  { key: "излишки", label: "Ortiqcha" },
  { key: "дефицит", label: "Kamomad" },
];

const isInventoryTab = (tab?: string) => tab === "переучет";

const defaultGridTemplate = "40px 1fr 1fr 70px 70px 140px 150px";
const defaultColumnLabels = ["№", "Kolleksiya", "Model / O'lcham / Rang", "Soni", "Hajmi", "Partiya", "Shtrix kod"];

const inventoryGridTemplate = "40px 1fr 1fr 100px 140px 150px";
const inventoryGridTemplateEditable = "40px 1fr 1fr 100px 140px 150px 40px";
const inventoryColumnLabels = ["№", "Kolleksiya", "Model / O'lcham / Rang", "Tekshirilgan", "Partiya", "Shtrix kod"];
const inventoryColumnLabelsEditable = [...inventoryColumnLabels, ""];

function formatPartiya(product: any, partiya: any): string {
  if (product?.partiya_title) return product.partiya_title;
  if (!partiya) return "—";
  const factory = partiya.factory?.title || "";
  const no = partiya.partiya_no?.title || "";
  const year = partiya.date ? new Date(partiya.date).getFullYear() : "";
  const joined = [factory, no, year].filter(Boolean).join("-");
  return joined || "—";
}

export default function FManagerPereuchotDetailPage() {
  const { filialReportId } = useParams();
  const reportId = filialReportId || "";
  const queryClient = useQueryClient();
  const [search] = useQueryState("search", parseAsString);
  const [activeTab, setActiveTab] = useState<string | undefined>("переучет");
  const [scanOpen, setScanOpen] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState<"close" | null>(null);
  const [editState, setEditState] = useState<{
    reInventoryId: string;
    currentValue: number;
    title?: string;
    isMetric?: boolean;
  } | null>(null);

  const { data: report } = useFilialReportOne({ reportId, enabled: !!reportId });
  const { data: totalsData } = useReInventoryTotals({
    reportId,
    type: activeTab,
    search: search || undefined,
    enabled: !!reportId,
  });
  const { data, isLoading } = useReInventoryItems({
    reportId,
    queries: { type: activeTab, search: search || undefined, limit: 50 },
    enabled: !!reportId,
  });

  const { mutate: closeReport, isPending: closing } = useCloseFilialReport();

  const items: any[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];
  const totals = totalsData as any;
  const reportStatus = (report?.status || "").toLowerCase();
  const isOpen = reportStatus === "open";

  const isInvTab = isInventoryTab(activeTab);
  const canEdit = isInvTab && isOpen; // Qayta ro'yxat tabi + OPEN status

  const gridTemplate = isInvTab
    ? (canEdit ? inventoryGridTemplateEditable : inventoryGridTemplate)
    : defaultGridTemplate;
  const columnLabels = isInvTab
    ? (canEdit ? inventoryColumnLabelsEditable : inventoryColumnLabels)
    : defaultColumnLabels;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReport] });
    queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReportTotals] });
    queryClient.invalidateQueries({ queryKey: [apiRoutes.filialReport, reportId] });
  };

  const handleClose = () => {
    if (!reportId) return;
    closeReport(reportId, {
      onSuccess: () => {
        toast.success("Tasdiqlashga yuborildi");
        invalidate();
        setStatusConfirm(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Xatolik");
      },
    });
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Toolbar + totals */}
      <ReportToolbar
        totalsItems={[
          { label: "Umumiy:", value: Number(totals?.count || 0), color: "#1a1a1a", suffix: "ta" },
          { value: Number(totals?.volume || 0), color: "#1a1a1a", suffix: "m²" },
          { value: Number(totals?.total || 0), color: "#1a1a1a", suffix: "$" },
        ]}
      />

      {/* Tabs + Qo'shish button + Tasdiqlashga yuborish */}
      <div className="flex items-center gap-[4px] mb-[10px]">
        <div className="flex gap-[4px]">
          {tabs.map((tab) => (
            <button
              key={tab.key || "all"}
              onClick={() => setActiveTab(tab.key)}
              className={`h-[34px] px-[14px] rounded-sm text-[13px] font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-[4px]">
          {isInvTab && isOpen && (
            <button
              onClick={() => setScanOpen(true)}
              className="h-[34px] px-[14px] rounded-sm bg-[#3ABC49] text-white text-[13px] font-medium flex items-center gap-[4px] hover:bg-[#33a942] transition-colors"
            >
              <Plus className="w-[16px] h-[16px]" />
              Qo'shish
            </button>
          )}

          {isOpen && (
            <button
              onClick={() => setStatusConfirm("close")}
              className="h-[34px] px-[14px] rounded-sm bg-white border border-[#0078D4] text-[#0078D4] text-[13px] font-medium hover:bg-[#e6f2fb]"
            >
              Tasdiqlashga yuborish
            </button>
          )}
          {reportStatus === "closed" && (
            <span className="text-[13px] text-[#a3a3a3]">M-manager tasdiqlashini kuting</span>
          )}
          {reportStatus === "accepted" && (
            <span className="text-[13px] text-[#3ABC49]">Tasdiqlangan</span>
          )}
        </div>
      </div>

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      {/* Items list */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="text-[14px] text-[#a3a3a3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          items.map((item, i) => {
            const bc = item.bar_code;
            const product = item.product || item;
            const partiya = product?.partiya || item?.partiya;

            const collectionTitle = bc?.collection?.title || "—";
            const modelTitle = bc?.model?.title || "";
            const sizeTitle = bc?.size?.title || "";
            const colorTitle = bc?.color?.title || "";
            const barcode = bc?.code || "—";

            const count = item.count || 0;
            const y = Number(item.y || 0);
            const checkCount = Number(item.check_count || 0);
            const sizeX = Number(bc?.size?.x || 0);
            const isMetric = bc?.isMetric;

            let displayCount: number = count;
            let displayVolume: number = y;
            if (activeTab === "излишки") {
              if (isMetric) {
                displayCount = 1;
                displayVolume = Math.max(0, checkCount / 100 - y);
              } else {
                const diff = Math.max(0, checkCount - count);
                displayCount = diff;
                displayVolume = diff * sizeX * y;
              }
            } else if (activeTab === "дефицит") {
              if (isMetric) {
                displayCount = 1;
                displayVolume = Math.max(0, y - checkCount / 100);
              } else {
                const diff = Math.max(0, count - checkCount);
                displayCount = diff;
                displayVolume = diff * sizeX * y;
              }
            } else {
              displayCount = isMetric ? 1 : count;
              displayVolume = y;
            }

            const isDifference = isMetric ? y * 100 !== checkCount : count !== checkCount;
            const isSurplus = isMetric ? checkCount > y * 100 : checkCount > count;

            const partiyaStr = formatPartiya(product, partiya);
            const modelRowText =
              [modelTitle, sizeTitle, colorTitle].filter(Boolean).join(" / ") || "—";

            if (isInvTab) {
              return (
                <ListRow
                  key={item.id || i}
                  gridTemplate={gridTemplate}
                  className="pl-[12px]"
                  minHeight={48}
                >
                  <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                  <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{collectionTitle}</span>
                  <span className="text-[13px] text-[#1a1a1a] truncate">{modelRowText}</span>
                  <span
                    className={`text-[13px] font-medium ${
                      isDifference ? (isSurplus ? "text-[#3ABC49]" : "text-[#EF5C12]") : "text-[#1a1a1a]"
                    }`}
                  >
                    {checkCount}
                  </span>
                  <span className="text-[13px] text-[#a3a3a3]">{partiyaStr}</span>
                  <span className="text-[13px] text-[#a3a3a3]">{barcode}</span>

                  {canEdit && (
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-[28px] w-[28px] flex items-center justify-center rounded-sm hover:bg-[#f5f7f9]">
                            <MoreHorizontal className="w-[16px] h-[16px] text-[#a3a3a3]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setEditState({
                                reInventoryId: item.id,
                                currentValue: checkCount,
                                title: `${collectionTitle} — ${modelRowText}`,
                                isMetric,
                              })
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="text-[13px]">Tahrirlash</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </ListRow>
              );
            }

            return (
              <ListRow
                key={item.id || i}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={48}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{collectionTitle}</span>
                <span className="text-[13px] text-[#1a1a1a] truncate">{modelRowText}</span>
                <span className="text-[13px] text-[#1a1a1a]">{displayCount}</span>
                <span className="text-[13px] text-[#1a1a1a]">{formatPrice(displayVolume)}</span>
                <span className="text-[13px] text-[#a3a3a3]">{partiyaStr}</span>
                <span className="text-[13px] text-[#a3a3a3]">{barcode}</span>
              </ListRow>
            );
          })
        )}
      </div>

      {/* Scan form as right side Sheet */}
      <Sheet open={scanOpen} onOpenChange={setScanOpen}>
        <SheetContent side="right" className="w-[520px] sm:max-w-[520px] p-0 overflow-y-auto">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Mahsulot qo'shish / tahrirlash</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <ActionPageQrCode />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit dialog */}
      {editState && (
        <EditProductDialog
          open={!!editState}
          onOpenChange={(o) => { if (!o) setEditState(null); }}
          reInventoryId={editState.reInventoryId}
          currentValue={editState.currentValue}
          title={editState.title}
          isMetric={editState.isMetric}
        />
      )}

      {/* Tasdiqlashga yuborish confirmation */}
      <Dialog open={!!statusConfirm} onOpenChange={(o) => { if (!o) setStatusConfirm(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Tasdiqlashga yuborish</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-[#1a1a1a]">
            Qayta ro'yxatni M-managerga tasdiqlashga yuborasizmi? Undan keyin scan qilib bo'lmaydi.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStatusConfirm(null)}>Bekor qilish</Button>
            <Button onClick={handleClose} disabled={closing}>
              {closing ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
              Yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
