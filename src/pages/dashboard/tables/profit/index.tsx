import { getMonth } from "date-fns";
import Filters from "./filters";
import { parseAsString, useQueryState } from "nuqs";
import { useFetchData } from "./queries";
import { apiRoutes } from "@/service/apiRoutes";
import { DataTable } from "@/components/ui/data-table";
import { CountryColumns  , CollectionColumns,
  FactoryColumns,} from "./columns";
import { useYear } from "@/store/year-store";


export default function ProfitTable() {
  const [filial] = useQueryState("filial");
  const [typeProfit] = useQueryState(
    "typeProfit",
    parseAsString.withDefault("country")
  );
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const {year}= useYear()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchData({
      queries: {
        filialId: filial || undefined,
        month,
        year,
        typeOther: "other",
      },
      api:
        typeProfit == "country"
          ? apiRoutes.countryOrderReport
          : typeProfit == "factory"
            ? apiRoutes.factoryOrderReport
            : apiRoutes.collectionOrderReport,
      enabled: true,
    });

  const collections = data?.pages?.flatMap((page) => page?.data ||page?.items  || []) || [];

  return (
    <>
      <Filters />

      <div className="bg-[#EEEEEE] flex">
            <p className=" p-[25px]   text-[17px] w-full">Итого </p>
            <p className=" p-[25px]  text-[17px] w-full">{data?.pages?.[0]?.meta.totals?.totalKv || 0} м² </p>
            <p className=" p-[25px]  text-[17px] w-full">{data?.pages?.[0]?.meta.totals?.totalPrice || 0} $ </p>
            <p className=" p-[25px]  text-[17px] w-full">{data?.pages?.[0]?.meta.totals?.totalNetProfitPrice || 0} $ </p>
        </div> 
      <div className="px-5 bg-card ">
        <DataTable
          ischeckble={false}
          columns={
            typeProfit == "country"
              ? CountryColumns
              : typeProfit == "factory"
                ? FactoryColumns
                : CollectionColumns
          }
          className="max-h-[calc(100vh-225px)]  scrollCastom"
          classNameBody="border-none"
          hasHeader={false}
          data={collections || []}
          isLoading={isLoading}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
