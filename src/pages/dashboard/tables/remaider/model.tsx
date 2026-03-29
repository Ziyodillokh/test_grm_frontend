import { DataTable } from "@/components/ui/data-table";

import { parseAsString, useQueryState } from "nuqs";
import { Dispatch, SetStateAction } from "react";
import { IRemainderTable } from ".";
import { useModelReport } from "@/pages/reports/m-manager/remaider/queries";
import { ChevronLeft } from "lucide-react";
import { ModelColumns } from "@/pages/reports/m-manager/remaider/columns";

export default function ModelTable({
  setRemainder,
  remainder,
}: {
  setRemainder: Dispatch<SetStateAction<IRemainderTable>>;
  remainder?: IRemainderTable;
}) {
  const [filialId] = useQueryState("filialRemaider", parseAsString);
  const [month] = useQueryState("month", parseAsString);
  const [typeOther] = useQueryState(
    "typeRemaiderOther",
    parseAsString.withDefault("none")
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useModelReport({
      queries: {
        filialId: filialId || undefined,
        month: month || undefined,
        collectionId: remainder?.collectionId || undefined,
        factory: remainder?.factoryId,
        country: remainder?.countryId,
        typeOther,
      },
      enabled: true,
    });

  const Models = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className="flex gap-1 px-5  my-4">
        <div
          onClick={() =>
            setRemainder({
              ...remainder,
              name: "collection",
            })
          }
          className="bg-primary cursor-pointer p-4 w-[120px] rounded-2xl flex items-center gap-2 text-white"
        >
          <ChevronLeft />
          <p>назад</p>
        </div>
      </div>
      <div className="bg-[#EEEEEE] flex">
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          Итого
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalKv || 0} м²
        </p>
        <p className=" p-[25px] border-border border-r  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalPrice || 0}м²
        </p>
        <p className=" p-[25px]  text-[17px] w-full">
          {data?.pages?.[0]?.meta.totals?.totalCount || 0} шт
        </p>
      </div>
    
      <div className="px-5 bg-card ">
        <DataTable
          columns={ModelColumns}
          data={Models || []}
          isLoading={isLoading}
          isRowClickble={false}
          hasHeader={false}
          ischeckble={false}
          onRowClick={(row) => {
            setRemainder({
              ...remainder,
              name: "size",
              modelId: row?.id || "",
            });
          }}
          className="max-h-[calc(100vh-135px)]  scrollCastom"
          classNameBody="border-none"
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
