import { DataTable } from "@/components/ui/data-table";

import {  CollectionColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useCollectionReport } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";

export default function CollectionTable() {
 const {meUser} = useMeStore()
  const [month] = useQueryState("month", parseAsString);
  const {year}= useYear()
  const [sort] = useQueryState("sort", parseAsString.withDefault("delears"));
  const [typeOther] = useQueryState("typeOther", parseAsString.withDefault("none"));
    const navigate = useNavigate()
    const {factoryId} = useParams()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionReport({
      queries: {
        filialId: meUser?.filial?.id || undefined,
        month: month || undefined,
        year,
        factory:factoryId,
        typeOther
      },
      enabled: sort == "delears",
    });

  const collections = data?.pages?.flatMap((page) => page?.data || []) || [];

  return (
    <>
      <Filter
        totalKv={data?.pages?.[0]?.meta.totals?.totalKv || 0}
        totalPrice={data?.pages?.[0]?.meta.totals?.totalPrice || 0}
        totalCount={data?.pages?.[0]?.meta.totals?.totalCount || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={CollectionColumns}
          data={collections || []}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item)=>navigate(`${item?.collection?.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
