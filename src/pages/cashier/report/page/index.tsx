import { useEffect } from "react";

import CardSort from "@/components/card-sort";
import { DataTable } from "@/components/ui/data-table";
import { useOpenKassa } from "@/pages/report/table/queries";
import { useMeStore } from "@/store/me-store";

import Filters from "../page/filter";
import Pricecheck from "../page/price-check";
import { useDataCashflow } from "../queries";
import { ReportColumns } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import CashierHeader from "@/layouts/main-layout/cashier-header";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "Терминал",
  discount: "Скидка",
  navar: "Навар",
};
const typeFilter: Record<string, string> = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};

export default function Page() {
  const { meUser } = useMeStore();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );
  const [id, setId] = useQueryState("id");

  useEffect(() => {
    setId(null);
  }, [sort]);

  const { data: reportData } = useOpenKassa({
    id: meUser?.filial?.id,
  });

  const [tip] = useQueryState("tip", parseAsString);

  const cashflowStatus =
    sort === "all" ? undefined : sort === "pending" ? "pending" : "accepted";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: reportData?.id || id || "",
        limit: 10,
        page: 1,
        // @ts-ignore
        tip: tipFilter[tip],
        // @ts-ignore
        type:
          sortSingle == "Все"
            ? typeFilter[tip as string]
            : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip == "collection" ? "Инкассация" : undefined,
        status: cashflowStatus,
      },
      enabled: !!reportData?.id || Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <CashierHeader>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Joriy Oy Kassasi</h1>
        </div>
        <Filters kassaId={reportData?.id} />
      </CashierHeader>
      <div className="flex w-full ">
        <div className=" mr-2 w-full">
          <CardSort
            isKassa={true}
            KassaId={reportData?.id || id || ""}
          />

          <div
            className={`${
              meUser?.position?.role == 4
                ? "h-[calc(100vh-285px)] scrollCastom"
                : "h-[calc(100vh-330px)] scrollCastom"
            }`}
          >
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
          </div>
        </div>
        {sort === "all" || !sort ? (
          <Pricecheck disabled={!flatData.length} id={reportData?.id || ""} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
