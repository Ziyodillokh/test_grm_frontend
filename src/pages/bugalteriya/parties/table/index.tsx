import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import ActionPage from "../form";
import { Columns } from "./columns";
import Filters from "./filters";
import useDataFetch from "./queries";
import { useMeStore } from "@/store/me-store";

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [country] = useQueryState("country");
  const [factory] = useQueryState("factory");
  const [partiyaNumber] = useQueryState("partiya-number");
  const [search] = useQueryState("search");
  const [,setItemName] = useQueryState("itemName")
const {meUser} = useMeStore()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        country: country || undefined,
        partiya_no: partiyaNumber || undefined,
        factory: factory || undefined,
        search: search || undefined,
        warehouse: (meUser?.position?.role == 7 || meUser?.position?.role == 4) ? meUser?.filial?.id : undefined,
      },
    });
    
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filters />
      <DataTable
        isLoading={isLoading}
        columns={Columns}
        data={flatData ?? []}
        className="h-[calc(100vh-140px)] scrollCastom"
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        onRowClick={(row)=>{
          setItemName(`${row?.factory?.title} ${row?.partiya_no?.title}`)
        }}
        isRowClickble
        isFetchingNextPage={isFetchingNextPage}
      />

      <ActionPage />
    </>
  );
}
