"use client";

import { DataTable } from "@/components/ui/data-table";
import { paymentColumns } from "./columns";
import Filters from "./filters";
import useCrops from "./queries";

export default function Page() {
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCrops({});

  const flatData = data?.pages?.flatMap(page => page?.items || []) || [];

  return (
    <>
      <Filters />
      {/* <CardSort /> */}
      <DataTable
        className="p-4"
        isLoading={isLoading}
        columns={paymentColumns}
        data={flatData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}