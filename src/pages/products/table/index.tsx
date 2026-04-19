import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Loader, X, LayoutList, LayoutGrid } from "lucide-react";

import { ListRow } from "@/components/ui/list-row";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { useMeStore } from "@/store/me-store";
import { apiRoutes } from "@/service/apiRoutes";
import { minio_img_url } from "@/constants";
import debounce from "@/utils/debounce";
import CarpetCard from "@/components/cards/carpet-card";

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
  const [collection, _setCollection] = useQueryState(
    "collection",
    parseAsString.withDefault("product")
  );
  const { meUser } = useMeStore();

  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    setFilterOpen(false);
  };

  const isLoading = isProductView ? isProductsLoading : isCollectionsLoading;
  const isFetchingNext = isProductView
    ? isFetchingNextProductsPage
    : isFetchingNextCollectionsPage;
  const dataLength = isProductView ? productsFlat.length : collections.length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-[4px] shrink-0 mb-[10px]">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-[4px] bg-white rounded-[8px] px-[10px] h-[42px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                stroke="#1A1A1A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.7508 15.7508L12.4883 12.4883"
                stroke="black"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Input
              ref={searchInputRef}
              autoFocus
              defaultValue={search || ""}
              onChange={debounce(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value || null);
                },
                500
              )}
              className="bg-transparent border-none h-[32px] w-[200px] p-0 text-[14px] shadow-none"
              placeholder="Qidirish..."
            />
            <X
              className="w-[16px] h-[16px] cursor-pointer text-[#A3A3A3] hover:text-[#1A1A1A]"
              onClick={() => {
                if (searchInputRef.current) searchInputRef.current.value = "";
                setSearch(null);
                setFilial(null);
                setShowSearch(false);
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                stroke="#1A1A1A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.7508 15.7508L12.4883 12.4883"
                stroke="black"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Sort */}
        <button className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask_sort_pd"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="1"
              y="3"
              width="16"
              height="12"
            >
              <path
                d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75"
                stroke="#1A1A1A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
            <g mask="url(#mask_sort_pd)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
            </g>
          </svg>
        </button>

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12"
                  stroke="#1A1A1A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] p-4">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              {!meUser?.filial?.id && (
                <div>
                  <p className="text-[13px] text-muted-foreground mb-1">
                    Filial
                  </p>
                  <FilialFilterSelect />
                </div>
              )}
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">
                  Ko'rinish
                </p>
                <FilterSelect
                  placeholder="Turi"
                  className="w-full"
                  defaultValue="product"
                  options={[
                    { label: "Mahsulot", value: "product" },
                    { label: "Kolleksiya", value: "collections" },
                  ]}
                  name="collection"
                />
              </div>
              {search && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full mt-2"
                >
                  Tozalash
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Excel */}
        <button
          onClick={handleExcelExport}
          disabled={excelPending}
          className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {excelPending ? (
            <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip_excel_pd)">
                <path
                  d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z"
                  fill="#1A1A1A"
                />
              </g>
              <defs>
                <clipPath id="clip_excel_pd">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </button>

        {/* Totals */}
        <div className="ml-auto flex items-center gap-[16px] bg-white rounded-[8px] px-[16px] h-[42px]">
          <span className="text-[13px] text-[#A3A3A3]">Umumiy:</span>
          {isProductView ? (
            <>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {displayTotals.count?.toLocaleString()} ta
              </span>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {displayTotals.kv?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
              </span>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {displayTotals.sum?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
              </span>
            </>
          ) : (
            <>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {(collectionMeta?.totalItems || collections.length).toLocaleString()} ta
              </span>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {collectionTotals.totalKv.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
              </span>
              <span className="text-[14px] font-medium text-[#1a1a1a]">
                {collectionTotals.totalCount.toLocaleString()} dona
              </span>
            </>
          )}
        </div>

        {/* View toggle: List / Card */}
        {isProductView && (
          <div className="flex items-center gap-[4px] ml-[4px]">
            <button
              onClick={() => setCard("list")}
              className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 transition-colors"
            >
              <LayoutList className={`w-[18px] h-[18px] ${isListView ? "text-[#0078D4]" : "text-[#1a1a1a] opacity-50"}`} />
            </button>
            <button
              onClick={() => setCard("card")}
              className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 transition-colors"
            >
              <LayoutGrid className={`w-[18px] h-[18px] ${!isListView ? "text-[#0078D4]" : "text-[#1a1a1a] opacity-50"}`} />
            </button>
          </div>
        )}
      </div>

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
    <div className="h-[80px] px-[10px] py-[8px] bg-white rounded-[8px] shrink-0 flex items-center gap-[16px]">
      {/* Rasm */}
      <div className="w-[40px] h-[64px] overflow-hidden bg-[#F5F5F5] shrink-0">
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

  return (
    <select
      value={filial || ""}
      onChange={(e) => setFilial(e.target.value || null)}
      className="w-full h-[40px] px-[12px] bg-input border border-border rounded-[8px] text-[14px] outline-none"
    >
      {!meUser?.filial?.id && <option value="">Barchasi</option>}
      {data?.map((f) => (
        <option key={f.id} value={f.id}>
          {f.title}
        </option>
      ))}
    </select>
  );
}
