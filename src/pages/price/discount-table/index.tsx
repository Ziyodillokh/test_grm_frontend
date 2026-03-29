import { useMemo } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import { getColumns } from "./columns";
import useDiscountDataFetch from "./queries";
import Filters from "../table/filters";
import ActionPage from "../discount-form";

export default function DiscountTablePage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");

  const columns = useMemo(() => getColumns(), []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDiscountDataFetch({
      queries: {
        limit,
        page,
        search: search || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filters />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />

      <ActionPage />
    </>
  );
}
