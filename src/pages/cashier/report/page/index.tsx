import { format } from "date-fns";
import { useEffect, useState } from "react";

import CardSort from "@/components/card-sort";
import { DataTable } from "@/components/ui/data-table";
import { useOpenKassa } from "@/pages/report/table/queries";
import { useMeStore } from "@/store/me-store";

import Filters from "../page/filter";
import Pricecheck from "../page/price-check";
import { useDataCashflow, useDataKassa } from "../queries";
import { KassaColumns, ReportColumns } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import CashierHeader from "@/layouts/main-layout/cashier-header";

const tipFilter = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal:"Терминал",
  discount:"Скидка",
  navar:"Навар",
};
const typeFilter = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};
export default function Page() {
  const [selectedItems] = useState<number[]>([]);
  const { meUser } = useMeStore();
  const [sort] = useQueryState("sort", parseAsString.withDefault("open"));
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );
  const [id, setId] = useQueryState("id");

  useEffect(() => {
    setId(null);
  }, [sort]);
  const { data: reportData } = useOpenKassa({
    id: sort == "open" ? meUser?.filial?.id : undefined,
  });

  const {
    data: kassaData,
    isLoading: KassaLoading,
    fetchNextPage: KassafetchNextPage,
    hasNextPage: KassafhasNextPage,
    isFetchingNextPage: KassaisFetchingNextPage,
  } = useDataKassa({
    queries: {
      filial: meUser?.filial?.id || "",
      limit: 10,
      status: sort,
      page: 1,
    },
    enabled: sort != "open" && !id,
  });
  const [tip] = useQueryState("tip", parseAsString);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: reportData?.id || id || "",
        limit: 10,
        page: 1,
        // @ts-ignore
        tip: tipFilter[tip],
        // @ts-ignore
        type: sortSingle == "Все" ? typeFilter[tip as string] : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip == "collection" ? "Инкассация" : undefined,
      },
      enabled: !!reportData?.id || Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const flatKasssaData =
    kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <CashierHeader>
        <Filters kassaId={reportData?.id} countLength={selectedItems?.length} />
      </CashierHeader>
      <div className="flex w-full ">
        <div className=" mr-2 w-full">
          {sort === "open" || Boolean(id) ? (
            <CardSort
              isKassa={true}
              KassaId={sort == "open" ? reportData?.id || "" : id || ""}
            />
          ) : (
            ""
          )}
        
        <div className={` ${(sort === "open" || Boolean(id)) ? meUser?.position?.role ==3 ? 'h-[calc(100vh-285px)] scrollCastom':'h-[calc(100vh-330px)] scrollCastom':""}  `}>
        {sort === "open" ? (
            ""
          ) : (
            <div className="px-4 pt-2 mb-1 w-full bg-background  z-10 sticky top-0">
              <p className="text-sm font-medium  ">
                {format(new Date(), "dd-MMMM")}
              </p>
            </div>
          )}
            {sort === "open" || Boolean(id) ? (
              <DataTable
                columns={ReportColumns}
                data={flatData || []}
                isLoading={isLoading}
                hasHeader={false}
                isRowClickble={false}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
              />
            ) : (
              <DataTable
                columns={KassaColumns || []}
                data={flatKasssaData || []}
                isLoading={KassaLoading}
                fetchNextPage={KassafetchNextPage}
                hasNextPage={KassafhasNextPage ?? false}
                isFetchingNextPage={KassaisFetchingNextPage}
              />
            )}
        </div>
       
        </div>
        {sort === "open" ? (
          <Pricecheck disabled={!flatData.length} id={reportData?.id || ""} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
