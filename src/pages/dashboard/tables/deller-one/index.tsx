import { DataTable } from "@/components/ui/data-table";
import useTransferDealersFetch from "@/pages/deller/single/queries";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { collactionColumns } from "./columns";
import { TransferCollectionDealerData } from "@/pages/reports/d-manager/transfer/type";
import { Dispatch, SetStateAction } from "react";
import { getMonth } from "date-fns";
import { MonthsArray } from "@/consts";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ChevronLeft } from "lucide-react";
import { useYear } from "@/store/year-store";

export default function DilerOneTable({dellerFilial,setDellerFilial}:{dellerFilial:string,setDellerFilial: Dispatch<SetStateAction<string | null>>}) {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const {year}= useYear()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransferDealersFetch({
      queries: {
        limit: limit,
        page: page,
        toId: dellerFilial || undefined,
        mode: "collection",
        month,
        year
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <>
 
 <div className="flex gap-1 px-5  my-4">
      <div onClick={()=>setDellerFilial(null)} className="bg-primary cursor-pointer p-5 w-[120px] rounded-2xl flex items-center gap-2 text-white">
        <ChevronLeft/>
        <p>назад</p>
      </div>
      <FilterSelect
        options={MonthsArray}
        name="month"
        defaultValue={getMonth(new Date()) + 1 + ""}
        className=" p-2 border-border border w-[250px]  placeholder:text-white "
      />
    </div>
      <div className="bg-[#EEEEEE] flex">
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          Итого
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.totalKv || 0} м² 
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.total_sum || 0} $
        </p>
        <p className=" p-[25px]  text-[17px] w-full">
          {data?.pages?.[0]?.totals?.total_profit_sum || 0} $
        </p>
      </div>
      <div className="px-5 bg-card ">
        <DataTable
          isLoading={isLoading}
          className="max-h-[calc(100vh-225px)]  scrollCastom"
          classNameBody="border-none"
          columns={collactionColumns}
          data={flatData as unknown as TransferCollectionDealerData[]}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          ischeckble={false}
          hasHeader={false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
