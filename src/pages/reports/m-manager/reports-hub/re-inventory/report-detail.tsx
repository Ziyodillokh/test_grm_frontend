import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ListRow } from "@/components/ui/list-row";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import ReportToolbar from "@/components/report-toolbar";
import ReportTotalsBar from "@/components/report-totals-bar";
import { apiRoutes } from "@/service/apiRoutes";

import {
  useReInventoryItems,
  useReInventoryTotals,
  useFilialReportOne,
  useDeleteReInventory,
  useCloseFilialReport,
  useAcceptFilialReport,
  useRejectFilialReport,
} from "./queries";
import AddProductDialog from "./add-product-dialog";
import EditProductDialog from "./edit-product-dialog";

const tabs = [
  { key: "переучет", label: "Qayta ro'yxat" },
  { key: undefined, label: "Qoldiq" },
  { key: "излишки", label: "Ortiqcha" },
  { key: "дефицит", label: "Kamomad" },
];

const isInventoryTab = (tab?: string) => tab === "переучет";

// Qayta ro'yxat tabi + report open bo'lsa — tahrirlash uchun 40px column qo'shiladi
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

export default function ReInventoryReportDetailPage() {
  const { reportId } = useParams();
  const queryClient = useQueryClient();
  const [search] = useQueryState("search", parseAsString);
  const [activeTab, setActiveTab] = useState<string | undefined>("переучет");
  const [addOpen, setAddOpen] = useState(false);
  const [editState, setEditState] = useState<{
    reInventoryId: string;
    currentValue: number;
    title?: string;
    isMetric?: boolean;
  } | null>(null);
  const [deleteState, setDeleteState] = useState<{ reInventoryId: string; title?: string } | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<"close" | "accept" | "reject" | null>(null);

  const { data: report } = useFilialReportOne({
    reportId: reportId || "",
    enabled: !!reportId,
  });

  const { data: totalsData } = useReInventoryTotals({
    reportId: reportId || "",
    type: activeTab,
    search: search || undefined,
    enabled: !!reportId,
  });

  const { data, isLoading } = useReInventoryItems({
    reportId: reportId || "",
    queries: {
      type: activeTab,
      search: search || undefined,
      limit: 50,
    },
    enabled: !!reportId,
  });

  const { mutate: removeReInventory, isPending: deleting } = useDeleteReInventory();
  const { mutate: closeReport, isPending: closing } = useCloseFilialReport();
  const { mutate: acceptReport, isPending: accepting } = useAcceptFilialReport();
  const { mutate: rejectReport, isPending: rejecting } = useRejectFilialReport();

  const items: any[] = data?.pages?.flatMap((page: any) => page?.items || []) || [];
  const totals = totalsData as any;
  const reportStatus = (report?.status || "").toLowerCase();
  const isOpen = reportStatus === "open";
  const isClosed = reportStatus === "closed";
  const filialId = report?.filial?.id;

  const isInvTab = isInventoryTab(activeTab);
  const canEdit = isInvTab && isOpen; // actions only when Qayta ro'yxat tab AND report open
  const canShowAddButton = isInvTab && isOpen;

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

  const handleDelete = () => {
    if (!deleteState?.reInventoryId) return;
    removeReInventory(deleteState.reInventoryId, {
      onSuccess: () => {
        toast.success("O'chirildi");
        invalidate();
        setDeleteState(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Xatolik");
      },
    });
  };

  const handleStatusAction = () => {
    if (!reportId || !statusConfirm) return;
    const handlers = {
      close: { mutate: closeReport, success: "Tasdiqlashga yuborildi" },
      accept: { mutate: acceptReport, success: "Qayta ro'yxat tasdiqlandi" },
      reject: { mutate: rejectReport, success: "Rad etildi — qayta scan uchun ochildi" },
    } as const;
    const h = handlers[statusConfirm];
    h.mutate(reportId, {
      onSuccess: () => {
        toast.success(h.success);
        invalidate();
        setStatusConfirm(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Xatolik");
      },
    });
  };

  const statusActionBusy = closing || accepting || rejecting;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar + totals */}
      <div className="flex items-center gap-[4px] mb-[10px]">
        <ReportToolbar />
        <ReportTotalsBar items={[
          { label: "Umumiy:", value: Number(totals?.count || 0), color: "#1a1a1a", suffix: "ta" },
          { value: Number(totals?.volume || 0), color: "#1a1a1a", suffix: "m²" },
          { value: Number(totals?.total || 0), color: "#1a1a1a", suffix: "$" },
        ]} />
      </div>

      {/* Tabs + Qo'shish button */}
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
          {canShowAddButton && (
            <button
              onClick={() => setAddOpen(true)}
              className="h-[34px] px-[14px] rounded-sm bg-[#3ABC49] text-white text-[13px] font-medium flex items-center gap-[4px] hover:bg-[#33a942] transition-colors"
            >
              <Plus className="w-[16px] h-[16px]" />
              Qo'shish
            </button>
          )}

          {/* OPEN: F-manager yakunlash (Tasdiqlashga yuborish) */}
          {isOpen && (
            <button
              onClick={() => setStatusConfirm("close")}
              className="h-[34px] px-[14px] rounded-sm bg-white border border-[#0078D4] text-[#0078D4] text-[13px] font-medium hover:bg-[#e6f2fb]"
            >
              Tasdiqlashga yuborish
            </button>
          )}

          {/* CLOSED: M-manager Tasdiqlash (yashil 10% bg) + 3-dot menu bilan Rad etish */}
          {isClosed && (
            <>
              <button
                onClick={() => setStatusConfirm("accept")}
                className="h-[34px] px-[14px] rounded-sm text-[#3ABC49] text-[13px] font-medium"
                style={{ backgroundColor: "rgba(58, 188, 73, 0.1)" }}
              >
                Tasdiqlash
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-[34px] w-[34px] rounded-sm bg-white hover:bg-gray-50 flex items-center justify-center">
                    <MoreHorizontal className="w-[18px] h-[18px] text-[#1a1a1a]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setStatusConfirm("reject")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-[#EF5C12]" />
                    <span className="text-[13px] text-[#EF5C12]">Rad etish</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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

            // Ortiqcha/Kamomad tablarda "Soni" va "Hajmi" farqni ko'rsatadi, registrdagi qiymatni emas
            let displayCount: number = count;
            let displayVolume: number = y;
            if (activeTab === "излишки") {
              // surplus: check_count > count (non-metric) / check_count > y*100 (metric)
              if (isMetric) {
                displayCount = 1;
                displayVolume = Math.max(0, checkCount / 100 - y);
              } else {
                const diff = Math.max(0, checkCount - count);
                displayCount = diff;
                displayVolume = diff * sizeX * y;
              }
            } else if (activeTab === "дефицит") {
              // deficit: count > check_count (non-metric) / y*100 > check_count (metric)
              if (isMetric) {
                displayCount = 1;
                displayVolume = Math.max(0, y - checkCount / 100);
              } else {
                const diff = Math.max(0, count - checkCount);
                displayCount = diff;
                displayVolume = diff * sizeX * y;
              }
            } else {
              // Qoldiq tab: show registered values
              displayCount = isMetric ? 1 : count;
              displayVolume = y;
            }

            const isDifference = isMetric
              ? (y * 100) !== checkCount
              : count !== checkCount;
            const isSurplus = isMetric
              ? checkCount > (y * 100)
              : checkCount > count;

            const partiyaStr = formatPartiya(product, partiya);
            const modelRowText = [modelTitle, sizeTitle, colorTitle].filter(Boolean).join(" / ") || "—";
            const reInventoryId = item?.id; // item here is a ReInventory row

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
                  <span className={`text-[13px] font-medium ${isDifference ? (isSurplus ? "text-[#3ABC49]" : "text-[#EF5C12]") : "text-[#1a1a1a]"}`}>
                    {checkCount}
                  </span>
                  <span className="text-[13px] text-[#a3a3a3]">{partiyaStr}</span>
                  <span className="text-[13px] text-[#a3a3a3]">{barcode}</span>

                  {canEdit && (
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-[28px] w-[28px] flex items-center justify-center rounded-sm hover:bg-[#f5f5f5]">
                            <MoreHorizontal className="w-[16px] h-[16px] text-[#a3a3a3]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setEditState({
                                reInventoryId,
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
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteState({ reInventoryId, title: `${collectionTitle} — ${modelRowText}` })
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF5C12]" />
                            <span className="text-[13px] text-[#EF5C12]">O'chirish</span>
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

      {/* Add Dialog */}
      {canShowAddButton && filialId && (
        <AddProductDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          filialId={filialId}
        />
      )}

      {/* Edit Dialog */}
      {editState && (
        <EditProductDialog
          open={!!editState}
          onOpenChange={(o) => {
            if (!o) setEditState(null);
          }}
          reInventoryId={editState.reInventoryId}
          currentValue={editState.currentValue}
          title={editState.title}
          isMetric={editState.isMetric}
        />
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteState} onOpenChange={(o) => { if (!o) setDeleteState(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Qayta ro'yxatdan o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-[#1a1a1a]">
            {deleteState?.title ? (
              <>
                <span className="font-medium">{deleteState.title}</span> mahsulotini qayta ro'yxatdan o'chirmoqchimisiz?
              </>
            ) : (
              "Ushbu mahsulotni qayta ro'yxatdan o'chirmoqchimisiz?"
            )}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteState(null)}>Bekor qilish</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status transition confirmation */}
      <Dialog open={!!statusConfirm} onOpenChange={(o) => { if (!o) setStatusConfirm(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {statusConfirm === "close" && "Tasdiqlashga yuborish"}
              {statusConfirm === "accept" && "Qayta ro'yxatni tasdiqlash"}
              {statusConfirm === "reject" && "Rad etish"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-[#1a1a1a]">
            {statusConfirm === "close" && "Qayta ro'yxatni tasdiqlashga yuborasizmi? Undan keyin scan qilib bo'lmaydi."}
            {statusConfirm === "accept" && "Qayta ro'yxatni tasdiqlaysizmi? Bu amal qaytarilmaydi — barcha mahsulotlar haqiqiy holatga yangilanadi."}
            {statusConfirm === "reject" && "Rad etsangiz — pereuchot qayta OPEN holatga qaytadi va scan davom etadi."}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStatusConfirm(null)}>Bekor qilish</Button>
            <Button
              onClick={handleStatusAction}
              disabled={statusActionBusy}
              className={statusConfirm === "accept" ? "bg-[#3ABC49] hover:bg-[#33a942]" : ""}
              variant={statusConfirm === "reject" ? "destructive" : "default"}
            >
              {statusActionBusy ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
              Davom etish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
