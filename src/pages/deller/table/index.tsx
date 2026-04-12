import { parseAsInteger, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/ui/data-table";

import { Columns } from "./columns";
import Filter from "./filter";
import useDataFetch from "./queries";

export default function Page() {
  const navigate = useNavigate();
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        type: "dealer",
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter />
      <DataTable
        isRowClickble={false}
        isLoading={isLoading}
        columns={Columns}
        onRowClick={(item) => {
          navigate(`/dealer/${item?.id}`);
        }}
        ischeckble={false}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
