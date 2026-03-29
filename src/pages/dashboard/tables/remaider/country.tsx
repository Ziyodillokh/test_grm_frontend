import { useCountryReport } from "@/pages/reports/m-manager/remaider/queries";
import Filters from "./filters";
import { parseAsString, useQueryState } from "nuqs";
import { DataTable } from "@/components/ui/data-table";
import { CountryColumns } from "../profit/columns";
import { Dispatch, SetStateAction } from "react";
import { IRemainderTable } from ".";

export default function CountryRemainderTable({
  setRemainder,
  remainder,
}: {
  setRemainder: Dispatch<
    SetStateAction<IRemainderTable>
  >;
  remainder?: IRemainderTable;
}) {
  const [filialRemaider] = useQueryState("filialRemaider");
  const [monthRemaider] = useQueryState("monthRemaider");
  const [typeOther] = useQueryState(
    "typeRemaiderOther",
    parseAsString.withDefault("none")
  );
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCountryReport({
      queries: {
        filialId: filialRemaider || undefined,
        month: monthRemaider || undefined,
        typeOther,
      },
      enabled: true,
    });

  const collections = data?.pages?.flatMap((page) => page?.data || []) || [];
  return (
    <>
      <Filters />
      <div className="bg-[#EEEEEE] flex">
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          Итого
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalKv || 0} м²
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalPrice || 0}м²
        </p>
        <p className=" p-[25px]  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalCount || 0} шт
        </p>
      </div>
      <div className="px-5 bg-card ">
        <DataTable
          columns={CountryColumns}
          data={collections || []}
          isLoading={isLoading}
          isRowClickble={false}
          hasHeader={false}
          ischeckble={false}
          className="max-h-[calc(100vh-225px)]  scrollCastom"
          classNameBody="border-none"
          onRowClick={(row)=>{
            setRemainder({
            ...remainder,
            countryId:row?.country?.id,
            name: "factory",
          })
        }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
