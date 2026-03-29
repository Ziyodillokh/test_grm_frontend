import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import Filters from "./filters";
import { getMonth } from "date-fns";
import useDataFetch from "./queries";
import { DataTable } from "@/components/ui/data-table";
import { Columns } from "./colums";
import { useYear } from "@/store/year-store";

export default function KentsTable() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [debls] = useQueryState("debls");
  const [month] = useQueryState(
    "monthKents",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const {year}= useYear()
  const [typeKents] = useQueryState("typeKents");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        type: typeKents == "clear" ? undefined : typeKents || undefined,
        debt_id: debls || undefined,
        month,
        year,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filters />
      <div className="bg-[#EEEEEE] flex">
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          Итого
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.kents_balance || 0} $ 
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.total_expense || 0} $
        </p>
        <p className=" p-[25px]  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.total_income || 0} $
        </p>
      </div>

      <DataTable
        isRowClickble={false}
        isLoading={isLoading}
        columns={Columns}
        ischeckble={false}
        hasHeader={false}
        className="max-h-[calc(100vh-225px)]  scrollCastom"
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
