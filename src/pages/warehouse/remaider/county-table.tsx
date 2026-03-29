import { DataTable } from "@/components/ui/data-table";

import {  CountryColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useCountryReport } from "./queries";
import { useNavigate } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";

export default function CountryTable() {
  const {year}= useYear()
  const {meUser} = useMeStore()
  const [month] = useQueryState("month", parseAsString);
  const [sort] = useQueryState("sort", parseAsString.withDefault("delears"));
    const navigate = useNavigate()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCountryReport({
      queries: {
        filialId: meUser?.filial?.id || undefined,
        month: month || undefined,
        year,
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
          columns={CountryColumns}
          data={collections || []}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item)=>navigate(`${item?.country?.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
