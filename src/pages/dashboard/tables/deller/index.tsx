import { parseAsFloat, parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import ActionPageDealer from "@/pages/filial/formDealer";

import { Columns } from "./columns";
import useDataFetch from "@/pages/deller/table/queries";
import DilerOneTable from "../deller-one";
import { useState } from "react";

export default function DilerTable() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [dellerFilial, setDellerFilial] = useState<string | null>(null);
  const [dellerowed] = useQueryState("dellerowed", parseAsFloat);
  const [dellergiven] = useQueryState("dellergiven", parseAsFloat);
  // const [search ] = useQueryState("search");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      queries: {
        limit,
        page,
        type: "dealer",
        // search:search || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      {!dellerFilial ? (
        <>
          <div className="bg-[#EEEEEE] flex">
            <p className=" p-[25px] border-border border-r  text-[17px] w-full">
              Итого
            </p>
            <p className=" p-[25px] border-border border-r  text-[17px] w-full">
              - {dellerowed} $
            </p>
            <p className=" p-[25px] border-border border-r  text-[17px] w-full">
              + {dellergiven} $
            </p>
            <p className=" p-[25px] border-border border-r  text-[17px] w-full">
              {(dellerowed || 0) - (dellergiven || 0)} $
            </p>
          </div>
          <div className="px-5 bg-card ">
            <DataTable
              isRowClickble={false}
              className="max-h-[calc(100vh-135px)]  scrollCastom"
              classNameBody="border-none"
              isLoading={isLoading}
              columns={Columns}
              ischeckble={false}
              hasHeader={false}
              data={flatData ?? []}
              onRowClick={(row) => setDellerFilial(row?.id)}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage ?? false}
              isFetchingNextPage={isFetchingNextPage}
            />
            <ActionPageDealer />
          </div>
        </>
      ) : (
        <DilerOneTable setDellerFilial={setDellerFilial} dellerFilial={dellerFilial} />
      )}
    </>
  );
}
