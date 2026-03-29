import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Filters from "./filters";
import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "./queries";
import { getMonth } from "date-fns";
import { Columns, DealerColumns } from "./colums";
import {  TData } from "./type";
import { useYear } from "@/store/year-store";


export default function SaleDebtTable() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [filial] = useQueryState("filial");
  const [month] = useQueryState("month", parseAsString.withDefault(getMonth(new Date()) + 1+""));
  const {year}= useYear()
  const [typeSaledebt] = useQueryState("typeSaleDebt",parseAsString.withDefault("debt"));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        filial:filial || undefined,
        month:month,
        type: typeSaledebt || undefined,
        year
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
        <Filters/>
        <div className="bg-[#EEEEEE] flex">
            <p className=" p-[25px]   text-[17px] w-full">Итого</p>
            <p className=" p-[25px]  text-[17px] w-full">{data?.pages?.[0]?.totals?.total_count || 0} шт </p>
            <p className=" p-[25px]  text-[17px] w-full">{data?.pages?.[0]?.totals?.total_kv || 0} м² </p>
            <p className=" p-[25px]  text-[17px] w-full"> {data?.pages?.[0]?.totals?.total_sum || 0} $ </p>
        </div> 
        <DataTable
        isRowClickble={false}
        isLoading={isLoading}
        // @ts-ignore
        columns={filial=="#dealers" ? DealerColumns as unknown as TData :Columns as unknown as TData}
        ischeckble={false}
        className="max-h-[calc(100vh-225px)]  scrollCastom"
        hasHeader={false}
        data={flatData  ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
       
    </>
  )
}
