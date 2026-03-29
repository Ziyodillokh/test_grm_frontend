import { DataTable } from "@/components/ui/data-table";

import {  SizeColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSizeReport } from "./queries";
import {  useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";

export default function SizeTable() {
  const {meUser} = useMeStore();
  const [month] = useQueryState("month", parseAsString);
  const {year}= useYear()
  const [sort] = useQueryState("sort", parseAsString.withDefault("delears"));
  const [typeOther] = useQueryState("typeOther", parseAsString.withDefault("none"));
    const {modelId,collectionId,factoryId,countryId} = useParams()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSizeReport({
      queries: {
        filialId: meUser?.filial?.id || undefined,
        month: month || undefined,
        model:modelId,
        year,
        collectionId:collectionId,
        factory:factoryId,
        country:countryId,
        typeOther
      },
      enabled: sort == "delears",
    });

  const Sizes = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter
        totalKv={data?.pages?.[0]?.meta.totals?.totalKv || 0}
        totalPrice={data?.pages?.[0]?.meta.totals?.totalPrice || 0}
        totalCount={data?.pages?.[0]?.meta.totals?.totalCount || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={SizeColumns}
          data={Sizes || []}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          // onRowClick={(item)=>navigate(`${item?.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
