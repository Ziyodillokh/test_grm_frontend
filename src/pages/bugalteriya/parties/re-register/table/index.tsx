import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import { RightSheet } from "@/components/ui/right-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ActionPageQrCode from "../form";
import Filter from "./filter";
import useDataFetch, { usePartiyaReport } from "./queries";
import { useMeStore } from "@/store/me-store";
import { usePartiyaById } from "../../form/actions";
import { ListRow } from "@/components/ui/list-row";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { AddData, PatchData } from "@/service/apiHelpers";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEditPartiyaProductStore } from "@/store/edit-partiya-product-store";
import { Input } from "@/components/ui/input";
import debounce from "@/utils/debounce";

import { TData } from "../type";

const GRID = "30px 1fr 130px 100px 110px 90px 90px 110px 110px 50px";
const COLLECTION_GRID = "30px 1fr 80px 100px 110px 130px 130px 130px";

function getMiqdor(row: TData, tip: string) {
  const isMetric = row?.bar_code?.isMetric;
  if (isMetric) {
    if (tip === "surplus") return (row.check_count || 0) - (row.y || 0) * 100;
    if (tip === "deficit") return (row.y || 0) * 100 - (row.check_count || 0);
    return (row.y || 0) * 100;
  }
  if (tip === "recount") return row.check_count || 0;
  if (tip === "deficit") return (row.count || 0) - (row.check_count || 0);
  if (tip === "surplus") return (row.check_count || 0) - (row.count || 0);
  return row.count || 0;
}

export default function ItemsPage() {
  const [search] = useQueryState("search");
  const { id } = useParams();
  const { meUser } = useMeStore();
  const isWManager = meUser?.position?.role == 7 || meUser?.position.role == 4;
  const queryClient = useQueryClient();

  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault(isWManager ? "recount" : "new")
  );
  const [type] = useQueryState("type", parseAsString.withDefault("default"));
  const [, setBarCode] = useQueryState("barcode");
  const [, setCount] = useQueryState("count", parseAsInteger.withDefault(0));
  const [, setProductId] = useQueryState("productId");
  const [addOpen, setAddOpen] = useQueryState(
    "addOpen",
    parseAsBoolean.withDefault(false)
  );

  const { data: onePartiya } = usePartiyaById({
    id: id ? id : undefined,
    queries: { populate: "*" },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        search: search || undefined,
        partiyaId: id || "",
        type: type || "default",
        tip: tip == "new" ? undefined : tip || undefined,
      },
    });

  const { data: PartiyaReportData } = usePartiyaReport({
    queries: {
      partiyaId: id || "",
      tip: tip == "new" ? undefined : tip || undefined,
      search: search || undefined,
    },
  });

  const flatData: TData[] = data?.pages?.flatMap((p) => p?.items || []) || [];

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

  const setEditProduct = useEditPartiyaProductStore((s) => s.setProduct);
  const editProduct = useEditPartiyaProductStore((s) => s.product);

  const handleAdd = () => {
    setEditProduct(null);
    setBarCode("new");
    setAddOpen(true);
  };

  const closeSheet = () => {
    setAddOpen(false);
    setBarCode(null);
    setEditProduct(null);
  };

  // O'zgartirish ruxsati:
  //   W-manager: faqat Qabul (переучет)
  //   M-manager: Ro'yxat (new) va Qabul (переучет); Kamomad (дефицит) va Ortiqcha (излишки) read-only
  const canModify = isWManager
    ? tip === "recount"
    : tip === "new" || tip === "recount";

  // Tahrirlash — 3 nuqta menyusidan ishga tushadi (row click emas)
  const handleEdit = (row: TData) => {
    // Factory rowda yo'q bo'lsa, partiya'dan olamiz
    setEditProduct({
      ...row,
      factory: row?.factory || (onePartiya as any)?.factory,
    } as any);
    setBarCode(row?.bar_code?.code || null);
    setProductId(row?.id);
    if (tip == "recount") {
      setCount(row?.bar_code?.isMetric ? (row?.y || 0) * 100 : row?.check_count || 0);
    } else {
      setCount(row?.bar_code?.isMetric ? (row?.y || 0) * 100 : row?.count || 0);
    }
    setAddOpen(true);
  };

  // Delete handler — Ortiqcha (излишки) tabida hide
  const { mutate: deleteRow } = useMutation({
    mutationFn: (rowId: string) =>
      PatchData(`/excel/change-count/${rowId}${tip == "new" ? "" : `?tip=${tip}`}`, {}),
    onSuccess: () => {
      toast.success("O'chirildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.excelProducts] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.excelProductsReport] });
    },
  });

  return (
    <div className="h-full flex flex-col">
      <Filter
        check={onePartiya?.check}
        partiyaStatus={onePartiya?.partiya_status}
        totals={PartiyaReportData}
        onAdd={handleAdd}
      />

      {/* Column labels */}
      {type === "collection" ? (
        <div
          className="shrink-0 px-[12px]"
          style={{ display: "grid", gridTemplateColumns: COLLECTION_GRID, gap: "8px" }}
        >
          <span className="text-[13px] text-[#A3A3A3]">No</span>
          <span className="text-[13px] text-[#A3A3A3]">Kalleksiya</span>
          <span className="text-[13px] text-[#A3A3A3]">Soni</span>
          <span className="text-[13px] text-[#A3A3A3]">Hajm</span>
          <span className="text-[13px] text-[#A3A3A3]">Qiymati</span>
          <span className="text-[13px] text-[#A3A3A3]">Zavod narxi (m²)</span>
          <span className="text-[13px] text-[#A3A3A3]">Ustama (m²)</span>
          <span className="text-[13px] text-[#A3A3A3] text-center">Kassa narxi (m²)</span>
        </div>
      ) : (
        <div
          className="shrink-0 px-[12px]"
          style={{ display: "grid", gridTemplateColumns: GRID, gap: "8px" }}
        >
          <span className="text-[13px] text-[#A3A3A3]">No</span>
          <span className="text-[13px] text-[#A3A3A3]">Kolleksiya</span>
          <span className="text-[13px] text-[#A3A3A3]">Model</span>
          <span className="text-[13px] text-[#A3A3A3]">Tip</span>
          <span className="text-[13px] text-[#A3A3A3]">O'lcham</span>
          <span className="text-[13px] text-[#A3A3A3]">Miqdor</span>
          <span className="text-[13px] text-[#A3A3A3]">Hajm</span>
          <span className="text-[13px] text-[#A3A3A3]">Rang</span>
          <span className="text-[13px] text-[#A3A3A3]">Shakl</span>
          <span />
        </div>
      )}

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollCastom pb-[20px]">
        <div className="flex flex-col gap-[4px]">
          {isLoading && flatData.length === 0 ? (
            <div className="flex items-center justify-center py-[40px]">
              <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
            </div>
          ) : flatData.length === 0 ? (
            <div className="flex items-center justify-center py-[40px] bg-white rounded-sm">
              <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
            </div>
          ) : type === "collection" ? (
            <>
              {flatData.map((row: any, idx) => (
                <CollectionRow
                  key={row.id || idx}
                  row={row}
                  idx={idx}
                  partiyaId={id || ""}
                  canModify={canModify}
                />
              ))}
              <div ref={sentinelRef} className="h-[1px]" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-[12px]">
                  <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
                </div>
              )}
            </>
          ) : (
            <>
              {flatData.map((row, idx) => {
                const isMetric = row?.bar_code?.isMetric;
                const miqdor = getMiqdor(row, tip);
                const hajm = Number(row?.bar_code?.size?.kv || 0).toFixed(1);
                return (
                  <ListRow
                    key={row.id}
                    gridTemplate={GRID}
                    minHeight={60}
                    onClick={() => handleEdit(row)}
                  >
                    <span className="text-[13px] text-[#A3A3A3]">{idx + 1}</span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row?.bar_code?.collection?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row?.bar_code?.model?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">
                      {isMetric ? "Metrazh" : "Dona"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">
                      {row?.bar_code?.size?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">
                      {miqdor} {isMetric ? "sm" : "x"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a]">{hajm} m²</span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row?.bar_code?.color?.title || "—"}
                    </span>
                    <span className="text-[14px] text-[#1a1a1a] truncate">
                      {row?.bar_code?.shape?.title || "—"}
                    </span>
                    <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                      {canModify && (
                        <TableAction
                          url={apiRoutes.excelProducts}
                          ShowPreview={false}
                          ShowUpdate={false}
                          ShowDelete={tip !== "surplus"}
                          costomDelete={() => deleteRow(row.id)}
                          id={row.id}
                          refetchUrl={apiRoutes.excelProducts}
                        >
                          <DropdownMenuItem onClick={() => handleEdit(row)}>
                            Tahrirlash
                          </DropdownMenuItem>
                        </TableAction>
                      )}
                    </div>
                  </ListRow>
                );
              })}
              <div ref={sentinelRef} className="h-[1px]" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-[12px]">
                  <Loader className="w-[18px] h-[18px] animate-spin text-[#A3A3A3]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add product sheet */}
      <RightSheet open={addOpen} onClose={closeSheet} title="Mahsulot qo'shish">
        <ActionPageQrCode key={editProduct?.id || "new"} />
      </RightSheet>
    </div>
  );
}

/* ── Kolleksiya satri (narx kiritish) ── */
function CollectionRow({
  row,
  idx,
  partiyaId,
  canModify,
}: {
  row: any;
  idx: number;
  partiyaId: string;
  canModify: boolean;
}) {
  const queryClient = useQueryClient();
  const collectionId = row?.id;
  const factoryDefault = Number(row?.factoryPricePerKv || 0);
  const overheadDefault = Number(row?.overheadPerKv || 0);
  const cassaPrice = row?.collectionPrice?.priceMeter;

  const { mutate: savePrice } = useMutation({
    mutationFn: async (payload: { factoryPricePerKv: number; overheadPerKv: number }) =>
      AddData(apiRoutes.partiyaCollectionPrice, {
        partiyaId,
        items: [{ collectionId, ...payload }],
      }),
    onSuccess: () => {
      toast.success("Saqlandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.excelProducts] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.partiyaCollectionPriceByPartiya] });
    },
  });

  const handleFactoryChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    savePrice({ factoryPricePerKv: Number(e.target.value), overheadPerKv: overheadDefault });
  }, 700);

  const handleOverheadChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    savePrice({ factoryPricePerKv: factoryDefault, overheadPerKv: Number(e.target.value) });
  }, 700);

  const kv = Number(row?.kv || 0);
  const qiymati = (factoryDefault * kv).toFixed(2);

  return (
    <ListRow gridTemplate={COLLECTION_GRID} minHeight={60}>
      <span className="text-[13px] text-[#A3A3A3]">{idx + 1}</span>
      <span className="text-[14px] text-[#1a1a1a] truncate">{row?.title || "—"}</span>
      <span className="text-[14px] text-[#1a1a1a]">{row?.count || 0}</span>
      <span className="text-[14px] text-[#1a1a1a]">{kv.toFixed(1)} m²</span>
      <span className="text-[14px] text-[#1a1a1a]">{qiymati} $</span>
      <Input
        defaultValue={factoryDefault || ""}
        type="number"
        placeholder="0"
        disabled={!canModify}
        className="h-[36px] w-[110px] rounded-[4px] text-[14px]"
        onChange={handleFactoryChange}
      />
      <Input
        defaultValue={overheadDefault || ""}
        type="number"
        placeholder="0"
        disabled={!canModify}
        className="h-[36px] w-[110px] rounded-[4px] text-[14px]"
        onChange={handleOverheadChange}
      />
      <span className="text-[14px] text-[#1a1a1a] text-center">
        {cassaPrice != null ? `${cassaPrice} $` : "—"}
      </span>
    </ListRow>
  );
}
