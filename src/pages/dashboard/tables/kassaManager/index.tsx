import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Filters from "./filters";
import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "./queries";
import { getMonth } from "date-fns";
import { Columns } from "./colums";
// import { useYear } from "@/store/year-store";

export default function KassaManagerTable() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [filial] = useQueryState("filial");
  const [month] = useQueryState("month", parseAsString.withDefault(getMonth(new Date()) + 1+""));
  const [typeKassamanager] = useQueryState("typeKassamanager");
  const [typeCashflow] = useQueryState("typeCashflow");
  const [managerId] = useQueryState("managerId");
  // const {year}= useYear()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        user_id:managerId || undefined,
        type:  typeKassamanager == "clear" ? undefined:typeKassamanager || undefined,
        filial_id:filial || undefined,
        month,
        // year,
        cashflow_type:typeCashflow == "clear" ? undefined: typeCashflow || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
        <Filters/>
        <div className="bg-[#EEEEEE] flex">
            <p className=" p-[25px]   text-[17px] w-full"><span className="opacity-40">Приход </span>   + {data?.pages?.[0]?.totals.total_income || 0}$ </p>
            <p className=" p-[25px]  text-[17px] w-full"><span className="opacity-40">Расход </span>   - {data?.pages?.[0]?.totals?.total_expense || 0}$ </p>
        </div> 
        <DataTable
        isRowClickble={false}
        isLoading={isLoading}
        columns={Columns}
        className="max-h-[calc(100vh-225px)]  scrollCastom" 
        ischeckble={false}
        hasHeader={false}
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
       
    </>
  )
}
