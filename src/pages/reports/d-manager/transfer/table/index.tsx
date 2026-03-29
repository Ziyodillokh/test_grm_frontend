import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "@/pages/deller/table/queries";

import { collactionColumns } from "./columns";
import Filters from "./filters";
import useTransfers from "./queries";
import { TData } from "@/pages/deller/type";
import { useNavigate } from "react-router-dom";

// const buildFlatList = (data:TransferData[]) => {
//   const result = [];
//   let lastDate = null;


//   for (const item of data) {
//     const group = item.group;
//     if (group !== lastDate) {
//       result.push({ type: 'header',transferer:item?.transferer,courier:item?.courier ,group: group });
//       lastDate = group;
//     }
//     result.push(item);
//   }

//   return result;
// };

export default function TrasferDealerPage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(50));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [search] = useQueryState("search")
  
const navigate = useNavigate()
  const [fromDate] = useQueryState<Date>("startDate", { parse: () =>null});
  const [toDate] = useQueryState<Date>("endDate",{ parse: () =>null});
  

  const { data: filialData } = useDataFetch({
    queries: {
      limit,
      page,
    },
  });

  const flatDataFilial =
    filialData?.pages?.flatMap((page) => page?.items) || [];
  const [filial, setFilial] = useQueryState(
    "filial",
    parseAsString.withDefault(
      flatDataFilial?.filter((i) => i.type === "filial")?.[0]?.id || ""
    )
  );
 
  const { data, isLoading,fetchNextPage, hasNextPage, isFetchingNextPage} = useTransfers({
    queries: {
      limit: 10,
      page: 1,
      dealer: filial,
      startDate:fromDate || undefined,
      endDate:toDate || undefined,
      search:search ||undefined,
    },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

 const onSelectFilial = (data:TData)=>{
  setFilial(data?.id)
 }
  return (
    <div className="grid grid-cols-12 gap-2 h-full">
      <div className="col-span-2  max-h-[calc(100vh-100px)] scrollCastom flex gap-2">
        <div className={`w-full h-full  `}>
          <div className="w-full flex h-[64px] items-center justify-between  border-solid  p-[21.22px] rounded-lg bg-sidebar">
            <h4 className="text-[14px] font-semibold  text-foreground">
                Дилеры
            </h4>
          </div>
        
          <div
            className={`p-3 px-0 mx-5  `}
          >
            {flatDataFilial
              ?.filter((i) => i.type === "dealer")
              .map((e) => (
                <button
                  key={e?.id}
                  onClick={() =>{
                     onSelectFilial(e)}}
                  className={`${filial === e.id ? "bg-sidebar" : ""} rounded-lg group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar px-3  py-2.5`}
                >
                  {e.title}
                </button>
              ))}
          </div>
        
        </div>
   
          {/* <div className={`w-full h-full border-r border-border `}>
            <div className="w-full flex h-[64px] items-center justify-between border-border border-solid border-b p-[21.22px] bg-sidebar">
              <h4 className="text-[14px] font-semibold text-foreground">
                Статус транзакции
              </h4>
            </div>
            <div className="p-3 px-0 mx-5">
              {[
                { id: "In", name: "Входящие" },
                { id: "Out", name: "Отправленные" },
                // { id: "New", name: "Новые" },
              ].map((e) => (
                <button
                  key={e?.id}
                  disabled={filial === e.id}
                  onClick={() => {
                    setType(e?.id)
                    setProgressStatus('all')
                  }}
                  className={`${type === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar px-3  py-2.5`}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div> */}
      </div>
      <div className="col-span-10">
        <Filters />
        <DataTable
          isLoading={isLoading}
          className="max-h-[calc(100vh-140px)]  scrollCastom"
          columns={collactionColumns}
          data={flatData}
          onRowClick={(item)=>{
            navigate(item?.id+`/?filial=${filial}`)
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
