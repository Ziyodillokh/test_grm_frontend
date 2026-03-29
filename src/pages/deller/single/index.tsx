import {  parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import { collactionColumns, ListColumns } from "./columns";
import Filters from "./filters";
import { TransferCollectionDealerData, TransferDealerData } from "../../reports/d-manager/transfer/type";
import useTransferDealersFetch from "./queries";
import {  useParams } from "react-router-dom";

const buildFlatList = (data:TransferDealerData[]) => {
  const result = [];
  let lastDate = null;
  let counter = 0; 

  for (const item of data) {
    const group = item.group;
    if (group !== lastDate) {
      result.push({ type: 'header',transferer:item?.transferer,courier:item?.courier ,group: group });
      lastDate = group;
      counter = 0; 
    }
    counter++; 
    result.push({
      ...item,
      number: counter, // add number field
    });
  }

  return result;
};

export default function TrasferDealerSinglePage() {
  const [mode] = useQueryState("mode", parseAsString.withDefault("collection"));
  const [search] = useQueryState("search");
  const { toId } = useParams();


  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransferDealersFetch({
      queries: {
        limit: 10,
        page: 1,
        search: search || undefined,
        toId,
        mode,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    
      <div className="col-span-10">
        <Filters />
        {mode == "collection" ? (
          <DataTable
            isLoading={isLoading}
            className="max-h-[calc(100vh-140px)]  scrollCastom"
            columns={collactionColumns}
            data={flatData as unknown as TransferCollectionDealerData[]}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            ischeckble={false}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <DataTable
            isLoading={isLoading}
            className="max-h-[calc(100vh-140px)]  scrollCastom"
            columns={ListColumns}
            data={buildFlatList(flatData) as unknown as TransferDealerData[]}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            ischeckble={false}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
  );
}
