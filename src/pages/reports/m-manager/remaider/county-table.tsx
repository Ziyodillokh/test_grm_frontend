import { DataTable } from "@/components/ui/data-table";

import {  CountryColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useCountryReport } from "./queries";
import { useNavigate } from "react-router-dom";
import { useYear } from "@/store/year-store";

export default function CountryTable() {
  const [filialId] = useQueryState("filial", parseAsString);
  const [month] = useQueryState("month", parseAsString);
  const {year}= useYear();
  const [sort] = useQueryState("sort", parseAsString.withDefault("delears"));
  const [typeOther] = useQueryState("typeOther", parseAsString.withDefault("none"));
    const navigate = useNavigate()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCountryReport({
      queries: {
        filialId: filialId || undefined,
        month: month || undefined,
        year,
        typeOther,
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
          onRowClick={(item)=>navigate(`/m-manager/report-remaider/${item?.country?.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
