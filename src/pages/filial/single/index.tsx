import { parseAsInteger, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";

import { DataTable } from "@/components/ui/data-table";

import { Columns } from "./columns";
import Filter from "./filter";
import useDataFetch from "./queries";

export default function SinglePage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const { id } = useParams();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        search: search || undefined,
        filialId: id || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className=" w-full">
      <Filter />
      <DataTable
        isLoading={isLoading}
        columns={Columns}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
