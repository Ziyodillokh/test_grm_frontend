import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { DataTable } from "@/components/ui/data-table";

import { Columns, TransferColumns } from "./columns";
import Filter from "./filter";
import useDataFetch, { useDataOrderFetch } from "./queries";
import { orderProduct } from "../type";


export default function SinglePage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [search] = useQueryState("search");
  const { id } = useParams();

  const [seleted, setSeleted] = useState<orderProduct[]>([]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        search: search || undefined,
        filialId: id || undefined,
      },
    });

  const {
    data: OrderData,
    isLoading: OrderIsloading,
    fetchNextPage: OrderFetchNextPage,
    hasNextPage: OrderHasNextPage,
    isFetchingNextPage: OrderIsFetchingNextPage,
  } = useDataOrderFetch({
    queries: {
      limit,
      page,
      is_transfer: true,
      search: search || undefined,
      // filial: id || undefined,
    },
  });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const flatOrderData =
    OrderData?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className=" w-full h-full">
      <Filter seleted={seleted} />
      <div className="grid grid-cols-2 h-[calc(100%-100px)]">
        <DataTable
          isLoading={isLoading}
          columns={Columns}
          data={flatData ?? []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          onSelectionChange={(e) => {
            const newIds = e.map((item) => {
              return {
                product: item.id,
                x:item.count || 1,
                isMetric: item?.bar_code?.isMetric,
                is_transfer: true,
              }
            });
            if (JSON.stringify(seleted) !== JSON.stringify(newIds)) {
              setSeleted(newIds);
            }
          }}
        />
        <DataTable
          isLoading={OrderIsloading}
          columns={TransferColumns}
          className="border-l h-full"
          data={flatOrderData ?? []}
          fetchNextPage={OrderFetchNextPage}
          hasNextPage={OrderHasNextPage ?? false}
          isFetchingNextPage={OrderIsFetchingNextPage}
        />
      </div>
    </div>
  );
}
