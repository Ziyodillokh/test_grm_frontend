import { ChangeEvent, useEffect, useRef, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Loader, Plus, MoreHorizontal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ReportToolbar from "@/components/report-toolbar";
import { OutlineButton } from "@/components/ui/outline-button";
import { RightSheet } from "@/components/ui/right-sheet";
import BarcodeGenerator from "@/components/react-barcode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadFile } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import useDataLibrary from "../table/queries";
import { TData } from "../type";
import ActionPageQrCode from "../form-qr-code";

// Shape title → icon path (currentColor)
const SHAPE_ICONS: Record<string, string> = {
  rectangle: "/icons/shape-rectangle.svg",
  square: "/icons/shape-square.svg",
  oval: "/icons/shape-oval.svg",
  circle: "/icons/shape-circle.svg",
  rulo: "/icons/shape-rulo.svg",
};

function getShapeIcon(title?: string): string | null {
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes("rect") || t.includes("to'g'ri") || t.includes("togri")) return SHAPE_ICONS.rectangle;
  if (t.includes("square") || t.includes("kvadrat")) return SHAPE_ICONS.square;
  if (t.includes("oval")) return SHAPE_ICONS.oval;
  if (t.includes("circle") || t.includes("doira") || t.includes("aylana")) return SHAPE_ICONS.circle;
  if (t.includes("rulo") || t.includes("roll") || t.includes("spiral")) return SHAPE_ICONS.rulo;
  return null;
}

const GRID =
  "170px minmax(110px, 1.2fr) minmax(100px, 1fr) 90px minmax(100px, 1fr) 50px minmax(90px, 1fr) 90px minmax(100px, 1fr) 28px";

export default function BarcodesPage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(50));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const [id, setId] = useQueryState("id");
  const isOpen = !!id;
  const closeSheet = () => setId(null);

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const MAX_FILE_SIZE = 5_000_000;

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Fayl 5MB dan kichik bo'lishi kerak");
      e.target.value = "";
      return;
    }
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      // Backend response: { created, updated, skipped, errors: [{row, code, message}] }
      const res: any = await UploadFile("qr-base/support", formData);
      const created = res?.created ?? 0;
      const updated = res?.updated ?? 0;
      const errors: any[] = res?.errors || [];
      let summary = `Yaratilgan: ${created}, yangilangan: ${updated}`;
      if (errors.length > 0) {
        const first = errors[0];
        summary += `\n${errors.length} qatorda xato: qator ${first.row} (code=${first.code || "—"}) — ${first.message}`;
        toast.warning(summary);
      } else {
        toast.success(`Excel import muvaffaqiyatli — ${summary}`);
      }
      queryClient.invalidateQueries({ queryKey: [apiRoutes.qrBase] });
    } catch (err: any) {
      // UploadFile o'zi handleError chaqiradi — bu yerda qo'shimcha toast kerak emas, faqat fallback
      const msg = err?.response?.data?.message;
      if (msg && typeof msg === "string") {
        // handleError allaqachon toast qildi — duplikat oldini olamiz
      } else {
        toast.error("Excel import qilishda kutilmagan xato. Server logs'ini tekshiring.");
      }
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDataLibrary({
    queries: {
      limit,
      page,
      search: search || undefined,
    },
  });

  const flatData: TData[] = data?.pages?.flatMap((p: any) => p?.items || []) || [];

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar + Qo'shish + Import — inline 30px o'ngda */}
      <div className="shrink-0">
        <ReportToolbar
          inlineControls={
            <OutlineButton
              icon={<Plus className="w-[16px] h-[16px]" />}
              onClick={() => setId("new")}
            >
              Qo'shish
            </OutlineButton>
          }
          actions={
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImportFile}
              />
              <OutlineButton
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
                icon={
                  importing ? (
                    <Loader className="w-[16px] h-[16px] animate-spin" />
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.33398 2V4.66667C9.33398 4.84348 9.40422 5.01305 9.52925 5.13807C9.65427 5.2631 9.82384 5.33333 10.0007 5.33333H12.6673M9.33398 2L4.66732 2C4.3137 2 3.97456 2.14048 3.72451 2.39052C3.47446 2.64057 3.33398 2.97971 3.33398 3.33333L3.33398 8.66667M9.33398 2L12.6673 5.33333M12.6673 5.33333L12.6673 12.6667C12.6673 13.0203 12.5268 13.3594 12.2768 13.6095C12.0267 13.8595 11.6876 14 11.334 14H7.66732M1.33398 12.6667H6.00065M6.00065 12.6667L4.00065 10.6667M6.00065 12.6667L4.00065 14.6667"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )
                }
              >
                Excel fayl import qilish
              </OutlineButton>
            </>
          }
        />
      </div>

      {/* Column labels */}
      <div
        className="shrink-0 px-[12px] pb-[6px]"
        style={{ display: "grid", gridTemplateColumns: GRID, gap: "12px" }}
      >
        <span className="text-[13px] text-[#A3A3A3]">Barcode</span>
        <span className="text-[13px] text-[#A3A3A3]">Kolleksiya</span>
        <span className="text-[13px] text-[#A3A3A3]">Model</span>
        <span className="text-[13px] text-[#A3A3A3]">Size</span>
        <span className="text-[13px] text-[#A3A3A3]">Color</span>
        <span className="text-[13px] text-[#A3A3A3]">Shape</span>
        <span className="text-[13px] text-[#A3A3A3]">Style</span>
        <span className="text-[13px] text-[#A3A3A3]">Tip</span>
        <span className="text-[13px] text-[#A3A3A3]">Country</span>
        <span />
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom pb-[20px]">
        {isLoading && flatData.length === 0 ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
          </div>
        ) : flatData.length === 0 ? (
          <div className="flex items-center justify-center py-[40px] bg-white rounded-[6px]">
            <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
          </div>
        ) : (
          <div className="flex flex-col gap-[4px]">
            {flatData.map((row) => {
              const shapeIcon = getShapeIcon(row.shape?.title);
              return (
                <div
                  key={row.id}
                  onClick={() => setId(row.id)}
                  className="bg-white rounded-[6px] h-[80px] px-[12px] grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: GRID, gap: "12px" }}
                >
                  <span className="flex items-center min-w-0">
                    {row.code ? (
                      <BarcodeGenerator
                        value={row.code}
                        height={36}
                        width={1.3}
                        fontSize={11}
                      />
                    ) : (
                      <span className="text-[14px] text-[#1a1a1a]">—</span>
                    )}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.collection?.title || "—"}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.model?.title || "—"}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.size?.title || "—"}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate flex items-center gap-[6px]">
                    {row.color?.code && (
                      <span
                        className="w-[14px] h-[14px] rounded-full shrink-0 border border-[#e7ebf0]"
                        style={{ background: row.color.code }}
                      />
                    )}
                    <span className="truncate">{row.color?.title || "—"}</span>
                  </span>
                  <span className="flex items-center justify-start text-[#1a1a1a]">
                    {shapeIcon ? (
                      <img src={shapeIcon} alt={row.shape?.title || ""} className="w-[16px] h-[16px]" />
                    ) : (
                      <span className="text-[14px] truncate">{row.shape?.title || "—"}</span>
                    )}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.style?.title || "—"}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.isMetric ? "Metrli" : "Donabay"}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a] truncate">
                    {row.country?.title || "—"}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f7f9] transition-colors"
                        aria-label="Aksiya"
                      >
                        <MoreHorizontal className="w-[20px] h-[20px]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[160px]">
                      <DropdownMenuItem onClick={() => setId(row.id)}>
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[#e5484d] focus:text-[#e5484d]"
                        onClick={() => { /* o'chirish — keyingi qadam */ }}
                      >
                        O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
            <div ref={sentinelRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-[12px]">
                <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Qo'shish / Tahrirlash sheet */}
      <RightSheet
        open={isOpen}
        onClose={closeSheet}
        title={id === "new" ? "Barcode qo'shish" : "Barcode tahrirlash"}
      >
        <ActionPageQrCode key={id || "new"} />
      </RightSheet>
    </div>
  );
}
