import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

// import TabsFilter from "@/components/filters-ui/tabs-filter";
import { DataTable } from "@/components/ui/data-table";

import { ProductColumns } from "./columns";
import Filters from "./filters";
import useDataFetch from "./queries";
import CarpetCard from "@/components/cards/carpet-card";
import PulishMadal from "../publish-madal";

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const [card] = useQueryState("card", parseAsString.withDefault("card"));
  const [collection] = useQueryState("collection", parseAsString.withDefault("product"));
  const [, setId] = useQueryState("id");

  // Product data fetch
  const {
    data: productsData,
    isLoading: isProductsLoading,
    fetchNextPage: fetchNextProductsPage,
    hasNextPage: hasNextProductsPage,
    isFetchingNextPage: isFetchingNextProductsPage
  } = useDataFetch({
    queries: {
      limit,
      page,
      status: "not_ready",
      search: collection == "product" ? search || undefined : undefined,
      // filialId:  filial|| undefined,
    },
  });

  const productsFlat = productsData?.pages?.flatMap((page) => page?.items || []) || [];

  const showProductTable = card !== "card";
  const showCardGrid = card === "card";

  return (
    <>
      <Filters />

      {/* <div className="scrollCastom ml-5">
        <TabsFilter />
      </div> */}
      {showCardGrid && (
        <div className="px-6 mt-4 h-[calc(100vh-163px)] scrollCastom grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6 overflow-y-auto">
          {productsFlat?.map((item) => (
            <CarpetCard
              producdId={""}
              key={item.id}
              id={item.id.toString()}
              isBron={false}
              carpetType="product"
              user={null}
              shape={item?.shape?.title || ""}
              discount={"0"}
              img={{
                path: item?.imgUrl?.path || ""
              }}
              model={item?.model?.title || ""}
              size={`${(item?.size?.x || 0) * 100}x${((item?.size?.y || 0) * 100).toFixed(0)}`}
              count={(1).toString()}
              price={(item.i_price || "0").toString()}
              colaction={item?.collection?.title || ""}
              color={item?.color?.title || ""}
              onPublish={() => setId(item.id.toString())}
            />
          ))}
          {/* Intersection Observer Target */}
          <div
            ref={(ref) => {
              if (ref) {
                const observer = new IntersectionObserver(
                  (entries) => {
                    if (entries[0].isIntersecting && hasNextProductsPage) {
                      fetchNextProductsPage();
                    }
                  },
                  { threshold: 1 }
                );
                observer.observe(ref);
                return () => observer.disconnect();
              }
            }}
            className="col-span-full h-10 w-full"
          />
        </div>
      )}

      {showProductTable && (
        <DataTable
          isLoading={isProductsLoading}
          columns={ProductColumns}
          data={productsFlat}
          isRowClickble={false}
          className="h-[calc(100vh-200px)] scrollCastom"
          fetchNextPage={fetchNextProductsPage}
          hasNextPage={hasNextProductsPage ?? false}
          isFetchingNextPage={isFetchingNextProductsPage}
        />
      )}

      <PulishMadal />
    </>
  );
}
