import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import ActionPage from "../form";
import ActionPageQrCode from "../form-qr-code";
import { Columns } from "./columns";
import Filter from "./filter";
import useDataLibrary from "./queries";

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [id] = useQueryState("id");
  const [search] = useQueryState("search");
  const { data, isLoading,fetchNextPage,hasNextPage,isFetchingNextPage } = useDataLibrary({
    queries: {
      limit,
      page,
      search: search || undefined,
    },
  });
  const flatData = data?.pages?.flatMap(page => page?.items || []) || [];

  return (
    <div className="flex w-full">
      {
        id ? <ActionPageQrCode/>:
        <ActionPage/>
      }
      <div className="w-2/3">
        <Filter/>
        <DataTable
          isLoading={isLoading}
          columns={Columns}
          data={flatData}
          className={' max-h-[calc(100vh-130px)]  scrollCastom'}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
