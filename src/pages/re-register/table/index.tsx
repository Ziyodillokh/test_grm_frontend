import { parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import ActionPageQrCode from "../form";
import { Columns } from "./columns";
import Filter from "./filter";
import useDataLibrary from "./queries";
import { apiRoutes } from "@/service/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { IProductCheckProductreport } from "../type";
// import { z } from "zod";
// enum ProductReportEnum {
//   SURPLUS = 'излишки',
//   DEFICIT = 'дефицит',
//   INVENTORY = 'переучет',
// }
// const schema = z.object({
//   id: z.array(z.string()),

// })

function ItemBottom({items}:{items:IProductCheckProductreport }){

  return(
    <div className="w-full flex items-center  justify-end pr-10 border-border border-t  bg-sidebar">
        <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
          Объем: {Number(items?.volume)?.toFixed(2) || 0} м²
        </div>
        <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
          Количество: { Number(items?.count)?.toFixed(0) || 0}
        </div>
        <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
          Сумма: { Number(items?.total)?.toFixed(2) || 0} $
        </div>
        {/* <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
          Расход: { Number(items?.expence)?.toFixed(2) || 0} $
        </div> */}
  </div>
  )
}

export default function Page() {
  const [search] = useQueryState("search");
  const { meUser } = useMeStore();
  const [type] = useQueryState("type", parseAsString.withDefault("переучет"));
  // const [, setIds] = useQueryState('ids',parseAsJson(schema.parse))

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataLibrary({
      queries: {
        search: search || undefined,
        filialId: meUser?.filial?.id || "",
        type: type == "all" ? undefined : type || "переучет",
      },
    });

    const productCheckProductreportQueries = {
      filialId: meUser?.filial?.id || undefined,
      tip: type == "all"? undefined : type || "переучет",
    }
     const {data:productCheckProductreport} = useQuery({
      queryKey: [apiRoutes.productCheckProductReport,productCheckProductreportQueries],
      queryFn: () => getAllData<IProductCheckProductreport, object>(apiRoutes.productCheckProductReport,productCheckProductreportQueries),
  })
  
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <div className="flex w-full">
      <ActionPageQrCode />
      <div className="w-2/3">
        <Filter />
        <DataTable
          // onSelectionChange={(e) => {
          //   if(e?.length){
          //    setIds({id:e?.map(items=>items?.id)});
          //   }
          // }}
          isLoading={isLoading}
          columns={Columns}
          className={ "h-[calc(100vh-175px)] scrollCastom"}
          data={flatData ?? []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
          {productCheckProductreport? <ItemBottom items={productCheckProductreport}/>:""}
      </div>
    </div>
  );
}
