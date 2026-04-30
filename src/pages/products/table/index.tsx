import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Loader, LayoutList, LayoutGrid } from "lucide-react";

import { ListRow } from "@/components/ui/list-row";
import FilterSelect from "@/components/filters-ui/filter-select";
import { FILTER_INPUT_TRIGGER } from "@/components/filters-ui/filter-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { useMeStore } from "@/store/me-store";
import { apiRoutes } from "@/service/apiRoutes";
import { minio_img_url } from "@/constants";
import CarpetCard from "@/components/cards/carpet-card";
import ReportToolbar from "@/components/report-toolbar";

import useDataFetch, { useCollectionDataFetch } from "./queries";
import { ProductsData, CollectionData } from "../type";

const productGridTemplate = "2fr 1fr 70px 70px 1fr 50px 60px 70px 1fr";

const productLabels = [
  "Kolleksiya",
  "Model",
  "O'lcham",
  "Shakl",
  "Rang",
  "Miqdor",
  "Hajm",
  "Summa",
  "Filial",
];

const collectionGridTemplate = "1fr 80px 80px 90px";
const collectionLabels = ["Kolleksiya", "Hajm", "Miqdor", "Narx"];

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [filial, setFilial] = useQueryState("filial");
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [card, setCard] = useQueryState("card", parseAsString.withDefault("list"));
  const [collection, setCollection] = useQueryState(
    "collection",
    parseAsString.withDefault("product")
  );
  const { meUser } = useMeStore();

  // Product data fetch
  const activeSearch = collection === "product" ? search || undefined : undefined;
  const activeFilialId = filial || meUser?.filial?.id || undefined;
  const {
    data: productsData,
    isLoading: isProductsLoading,
    fetchNextPage: fetchNextProductsPage,
    hasNextPage: hasNextProductsPage,
    isFetchingNextPage: isFetchingNextProductsPage,
  } = useDataFetch({
    queries: {
      limit,
      page,
      search: activeSearch,
      filialId: activeFilialId,
    },
    role: meUser?.position?.role,
  });

  const {
    data: collectionsData,
    isLoading: isCollectionsLoading,
    fetchNextPage: fetchNextCollectionsPage,
    hasNextPage: hasNextCollectionsPage,
    isFetchingNextPage: isFetchingNextCollectionsPage,
  } = useCollectionDataFetch({
    filialId: filial || meUser?.filial?.id,
    search: collection !== "product" ? search || undefined : undefined,
  });

  const productsFlat =
    productsData?.pages?.flatMap((p) => p?.items || []) || [];
  const collections =
    collectionsData?.pages?.flatMap((p) => p?.items || []) || [];

  // Totals from backend (filter/search bilan bir xil)
  const totals = productsData?.pages?.[0]?.totals;
  const collectionMeta = collectionsData?.pages?.[0]?.meta;

  const displayTotals = {
    count: totals?.count || 0,
    kv: totals?.kv || 0,
    sum: totals?.totalSum || 0,
  };

  // Collection totals
  const collectionTotals = useMemo(() => {
    let totalCount = 0;
    let totalKv = 0;
    for (const item of collections) {
      totalCount += item.totalCount || 0;
      totalKv += parseFloat(item.totalKv as string) || 0;
    }
    return { totalCount, totalKv };
  }, [collections]);

  const isProductView = collection === "product";
  const isListView = card === "list";

  // Search natijasi bo'lgan filiallar ro'yxati (findAll javobidan)
  const searchFilials = (productsData?.pages?.[0] as any)?.searchFilials || [];

  // Excel export
  const [excelPending, setExcelPending] = useState(false);
  const handleExcelExport = async () => {
    setExcelPending(true);
    try {
      const filialId = filial || meUser?.filial?.id || "";
      const url =
        import.meta.env.VITE_BASE_URL +
        apiRoutes.excelProductExcelNew +
        `?filialId=${filialId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Export xatolik: ${response.status}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "products.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } finally {
      setExcelPending(false);
    }
  };

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      if (isProductView && hasNextProductsPage && !isFetchingNextProductsPage) {
        fetchNextProductsPage();
      }
      if (
        !isProductView &&
        hasNextCollectionsPage &&
        !isFetchingNextCollectionsPage
      ) {
        fetchNextCollectionsPage();
      }
    },
    [
      isProductView,
      hasNextProductsPage,
      isFetchingNextProductsPage,
      fetchNextProductsPage,
      hasNextCollectionsPage,
      isFetchingNextCollectionsPage,
      fetchNextCollectionsPage,
    ]
  );
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "0px 0px 400px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const clearFilters = () => {
    setSearch(null);
    setFilial(null);
    setCollection(null);
  };

  const hasActiveFilter = !!search || !!filial || collection !== "product";

  const totalsItems = isProductView
    ? [
        { value: displayTotals.count, suffix: "ta" },
        { value: displayTotals.kv, suffix: "m²" },
        { value: displayTotals.sum, suffix: "$" },
      ]
    : [
        { value: collectionMeta?.totalItems || collections.length, suffix: "ta" },
        { value: collectionTotals.totalKv, suffix: "m²" },
        { value: collectionTotals.totalCount, suffix: "dona" },
      ];

  const isLoading = isProductView ? isProductsLoading : isCollectionsLoading;
  const isFetchingNext = isProductView
    ? isFetchingNextProductsPage
    : isFetchingNextCollectionsPage;
  const dataLength = isProductView ? productsFlat.length : collections.length;

  const viewToggle = isProductView ? (
    <div className="h-[42px] bg-[#E7EBF0] rounded-sm p-[2px] flex items-center gap-[2px]">
      <button
        onClick={() => setCard("list")}
        className={`w-[38px] h-[38px] rounded-sm flex items-center justify-center transition-colors ${
          isListView ? "bg-white" : "bg-transparent hover:bg-white/40"
        }`}
        aria-label="Ro'yxat ko'rinishi"
      >
        <LayoutList
          className={`w-[18px] h-[18px] ${isListView ? "text-[#1a1a1a]" : "text-[#1a1a1a] opacity-50"}`}
        />
      </button>
      <button
        onClick={() => setCard("card")}
        className={`w-[38px] h-[38px] rounded-sm flex items-center justify-center transition-colors ${
          !isListView ? "bg-white" : "bg-transparent hover:bg-white/40"
        }`}
        aria-label="Karta ko'rinishi"
      >
        <LayoutGrid
          className={`w-[18px] h-[18px] ${!isListView ? "text-[#1a1a1a]" : "text-[#1a1a1a] opacity-50"}`}
        />
      </button>
    </div>
  ) : null;

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        onExport={handleExcelExport}
        excelPending={excelPending}
        hasActiveFilter={hasActiveFilter}
        onClearFilters={clearFilters}
        totalsItems={totalsItems}
        actions={viewToggle}
        filterContent={
          <>
            {!meUser?.filial?.id && (
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
                <FilialFilterSelect />
              </div>
            )}
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Ko'rinish</p>
              <FilterSelect
                variant="filter"
                placeholder="Turini tanlang"
                defaultValue="product"
                options={[
                  { label: "Mahsulot", value: "product" },
                  { label: "Kolleksiya", value: "collections" },
                ]}
                name="collection"
                classNameContainer="z-[60]"
              />
            </div>
          </>
        }
      />

      {/* Search filial chiplar — search pastida, labels ustida */}
      {isProductView && activeSearch && searchFilials && searchFilials.length > 0 && (
        <div className="flex items-center gap-[8px] mb-[10px] shrink-0 flex-wrap">
          {/* 1-chi: "Barchasi" faqat filiali yo'q userlar uchun (m-manager) */}
          {!filial && !meUser?.filial?.id && (
            <button
              className="text-[12px] px-[10px] py-[4px] rounded-full border bg-[#1a1a1a] text-white border-[#1a1a1a]"
            >
              Barchasi
            </button>
          )}
          {searchFilials.map((f: { id: string; title: string; count: number }) => {
            const isActive = activeFilialId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilial(isActive ? null : f.id)}
                className={`text-[12px] px-[10px] py-[4px] rounded-full border transition-colors ${
                  isActive
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white text-[#1a1a1a] border-border hover:bg-gray-50"
                }`}
              >
                {f.title} ({f.count})
              </button>
            );
          })}
        </div>
      )}

      {/* === PRODUCT LIST VIEW === */}
      {isProductView && isListView && (
        <>
          {/* Labels */}
          <div
            className="mb-[10px] shrink-0"
            style={{
              display: "grid",
              gridTemplateColumns: productGridTemplate,
              gap: "16px",
              paddingLeft: "66px",
              paddingRight: "10px",
            }}
          >
            {productLabels.map((label, i) => (
              <span key={i} className="text-[13px] text-[#A3A3A3]">
                {label}
              </span>
            ))}
          </div>

          {/* Product rows */}
          <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
            {isLoading && dataLength === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
              </div>
            ) : dataLength === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <span className="text-[13px] text-[#A3A3A3]">
                  Mahsulot topilmadi
                </span>
              </div>
            ) : (
              <>
                {productsFlat.map((item, i) => (
                  <ProductRow key={item?.id || i} item={item} />
                ))}
                <div ref={loadMoreRef} className="h-[1px]" />
                {isFetchingNext && (
                  <div className="flex items-center justify-center py-[10px]">
                    <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* === PRODUCT CARD VIEW === */}
      {isProductView && !isListView && (
        <div className="flex-1 min-h-0 overflow-auto scrollCastom">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6">
            {productsFlat.map((item) => (
              <CarpetCard
                producdId={""}
                key={item.id}
                id={item.id.toString()}
                isBron={false}
                carpetType="product"
                user={null}
                shape={item.bar_code?.shape?.title || ""}
                discount={"0"}
                img={{
                  path: item.bar_code?.imgUrl?.path || "",
                }}
                model={item.bar_code?.model?.title || ""}
                size={`${((item.bar_code?.size?.x || 0) * 100).toFixed(0)}x${((item.bar_code?.size?.y || 0) * 100).toFixed(0)}`}
                count={(item.count || "0").toString()}
                price={(item.price || "0").toString()}
                colaction={item.bar_code?.collection?.title || ""}
                color={item.bar_code?.color?.title || ""}
              />
            ))}
            <div ref={loadMoreRef} className="col-span-full h-10 w-full" />
          </div>
        </div>
      )}

      {/* === COLLECTION LIST VIEW === */}
      {!isProductView && (
        <>
          {/* Labels */}
          <div
            className="mb-[10px] shrink-0 px-[12px]"
            style={{
              display: "grid",
              gridTemplateColumns: collectionGridTemplate,
              gap: "8px",
            }}
          >
            {collectionLabels.map((label, i) => (
              <span key={i} className="text-[13px] text-[#A3A3A3]">
                {label}
              </span>
            ))}
          </div>

          {/* Collection rows */}
          <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
            {isCollectionsLoading && collections.length === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
              </div>
            ) : collections.length === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <span className="text-[13px] text-[#A3A3A3]">
                  Kolleksiya topilmadi
                </span>
              </div>
            ) : (
              <>
                {collections.map((item, i) => (
                  <CollectionRow key={item?.id || i} item={item} />
                ))}
                <div ref={loadMoreRef} className="h-[1px]" />
                {isFetchingNextCollectionsPage && (
                  <div className="flex items-center justify-center py-[10px]">
                    <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProductRow({ item }: { item: ProductsData }) {
  const bc = item.bar_code;
  const imgPath = bc?.imgUrl?.path;
  const collectionName = bc?.collection?.title || "—";
  const modelName = bc?.model?.title || "—";
  const sizeX = (bc?.size?.x || 0) * 100;
  const sizeY = (bc?.size?.y || 0) * 100;
  const sizeStr = `${sizeX.toFixed(0)}x${sizeY.toFixed(0)}`;
  const shapeName = bc?.shape?.title || "—";
  const colorName = bc?.color?.title || "—";
  const count = item.count || 0;
  const isMetric = bc?.isMetric || false;
  const volume = isMetric
    ? (item.y || 0) * (bc?.size?.x || 0)
    : count * (bc?.size?.x || 0) * (bc?.size?.y || 0);
  // Summa = priceMeter * hajm(m²)
  const priceMeter = item.priceMeter || bc?.collection?.collection_prices?.[0]?.priceMeter || 0;
  const summa = priceMeter * volume;
  const filialName = item.filial?.title || "—";

  return (
    <div className="h-[80px] px-[10px] py-[8px] bg-white rounded-sm shrink-0 flex items-center gap-[16px]">
      {/* Rasm */}
      <div className="w-[40px] h-[64px] overflow-hidden bg-[#f5f7f9] shrink-0">
        {imgPath ? (
          <img
            src={minio_img_url + imgPath}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A3A3A3] text-[10px]">
            —
          </div>
        )}
      </div>

      {/* Data grid — 9 ustun, labellar bilan bir xil */}
      <div
        className="flex-1 min-w-0 items-center"
        style={{
          display: "grid",
          gridTemplateColumns: productGridTemplate,
          gap: "16px",
        }}
      >
        <span className="text-[13px] font-medium text-[#1a1a1a] truncate">{collectionName}</span>
        <span className="text-[13px] text-[#1a1a1a] truncate">{modelName}</span>
        <span className="text-[13px] text-[#1a1a1a]">{sizeStr}</span>
        <span className="text-[13px] text-[#1a1a1a] truncate">{shapeName}</span>
        <span className="text-[13px] text-[#1a1a1a] truncate">{colorName}</span>
        <span className="text-[13px] font-medium text-[#1a1a1a]">{count} x</span>
        <span className="text-[13px] text-[#1a1a1a]">{volume.toFixed(1)} m²</span>
        <span className="text-[13px] font-medium text-[#EC6724]">{summa ? `${summa.toLocaleString()}$` : "—"}</span>
        <span className="text-[13px] text-[#1a1a1a] truncate">{filialName}</span>
      </div>
    </div>
  );
}

function CollectionRow({ item }: { item: CollectionData }) {
  const price = item.collectionPrices?.[0]?.priceMeter;

  return (
    <ListRow gridTemplate={collectionGridTemplate}>
      {/* Kolleksiya */}
      <span className="text-[13px] font-medium text-[#1a1a1a]">
        {item.title}
      </span>

      {/* Hajm */}
      <span className="text-[13px] text-[#1a1a1a]">{item.totalKv} m²</span>

      {/* Miqdor */}
      <span className="text-[13px] text-[#1a1a1a]">{item.totalCount} ta</span>

      {/* Narx */}
      <span className="text-[13px] font-medium text-[#EC6724]">
        {price ? `${price}$` : "—"}
      </span>
    </ListRow>
  );
}

function FilialFilterSelect() {
  const { meUser } = useMeStore();
  const [filial, setFilial] = useQueryState("filial");

  const { data } = useQuery({
    queryKey: ["/filial/warehouse-and-filial"],
    queryFn: () =>
      getAllData<{ items: { id: string; title: string; type: string }[]; meta: any }, { limit: number }>(
        "/filial/warehouse-and-filial",
        { limit: 50 }
      ),
    select: (res) =>
      res?.items
        ?.filter((i) => i.type !== "market" && i.type !== "dealer")
        .sort((a, b) =>
          a.id === meUser?.filial?.id ? -1 : b.id === meUser?.filial?.id ? 1 : 0
        ) || [],
  });

  const selected = data?.find((f) => f.id === filial);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={FILTER_INPUT_TRIGGER}>
          <span className="flex-1 text-left truncate">{selected?.title || "Barchasi"}</span>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a] shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-[4px] max-h-[320px] overflow-y-auto scrollCastom"
      >
        <button
          type="button"
          onClick={() => setFilial(null)}
          className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
            !filial ? "bg-[#f5f7f9] font-medium" : ""
          }`}
        >
          Barchasi
        </button>
        {data?.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilial(f.id)}
            className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
              filial === f.id ? "bg-[#f5f7f9] font-medium" : ""
            }`}
          >
            {f.title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
