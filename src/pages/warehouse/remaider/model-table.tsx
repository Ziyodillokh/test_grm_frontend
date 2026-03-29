import { DataTable } from "@/components/ui/data-table";

import {  ModelColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useModelReport } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";

export default function ModelTable() {
  const {meUser} = useMeStore();
  const {year}= useYear()
  const [month] = useQueryState("month", parseAsString);
  const [sort] = useQueryState("sort", parseAsString.withDefault("delears"));
    const navigate = useNavigate()
    const {collectionId} = useParams()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useModelReport({
      queries: {
        filialId: meUser?.filial?.id || undefined,
        month: month || undefined,
        year,
        collectionId:collectionId
      },
      enabled: sort == "delears",
    });

  const Models = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter
        totalKv={data?.pages?.[0]?.meta.totals?.totalKv || 0}
        totalPrice={data?.pages?.[0]?.meta.totals?.totalPrice || 0}
        totalCount={data?.pages?.[0]?.meta.totals?.totalCount || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={ModelColumns}
          data={Models || []}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item)=>navigate(`${item?.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
