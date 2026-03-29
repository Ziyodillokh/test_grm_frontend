import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Filters from "./filters";
import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "./queries";
import { getMonth } from "date-fns";
import { Columns } from "./colums";
import { useYear } from "@/store/year-store";

export default function ExpenseTable() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [filial] = useQueryState("filial");
  const [month] = useQueryState("month", parseAsString.withDefault(getMonth(new Date()) + 1+""));
  const {year}= useYear()
  const [typeExpense] = useQueryState("typeExpense");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        filial_id:filial || undefined,
        month,
        year,
        cashflow_type:typeExpense == "clear" ? undefined: typeExpense || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
        <Filters/>
        <div className="bg-[#EEEEEE] flex">
            <p className=" p-[25px]   text-[17px] w-full"><span className="opacity-40">Босс </span>   - {data?.pages?.[0]?.totals.boss || 0}$ </p>
            <p className=" p-[25px]  text-[17px] w-full"><span className="opacity-40">Бизнес </span>   - {data?.pages?.[0]?.totals?.business || 0}$ </p>
            <p className=" p-[25px]  text-[17px] w-full"><span className="opacity-40">Касса </span>   - {data?.pages?.[0]?.totals?.kassa || 0}$ </p>
        </div> 
        <DataTable
        isRowClickble={false}
        isLoading={isLoading}
        columns={Columns}
        ischeckble={false}
        className="max-h-[calc(100vh-225px)]  scrollCastom"
        hasHeader={false}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
       
    </>
  )
}
