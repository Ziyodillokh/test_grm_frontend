import { useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
import { CashflowList } from "@/components/cashflow-list";
import {  parseAsIsoDate, parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { useDataCashflow } from "./queries";

const tipFilter = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal:"terminal",
  discount:"discount",
  navar:"markup",
};

const typeFilter = {
  income: "income",
  expense: "expense",
  sale: "income",
  return: "expense",
};
export default function SinglePage() {
  const { meUser } = useMeStore();

  const { id,report } = useParams();
  const [cashflowSlug] = useQueryState("cashflowSlug", parseAsString);
  const [startDate] = useQueryState("startDate",parseAsIsoDate);
  const [endDate] = useQueryState("endDate",parseAsIsoDate);
  const [tip] = useQueryState("tip", parseAsString);
  const [search] = useQueryState("search", parseAsString);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: id != "my" ?id :undefined,
        limit: 10,
        page: 1,
        filialId: report ? undefined: meUser?.filial?.id || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        kassa: id=="my" ?report ||undefined: undefined,
           // @ts-ignore
       type: typeFilter[tip as string],
       // @ts-ignore
       tip: tipFilter[tip],
       search: search || undefined,
       cashflowSlug: tip == "collection" ? "cashCollection" :cashflowSlug|| undefined,
      },
      enabled: Boolean(id),
    });
    // const { data: KassaReportSingle } = useKassaReportSingle({
    //   id:report || undefined,
    //   enabled: Boolean(report),
    // });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage(); },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Filter />
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <CardSort
          KassaId={id != 'my'? id : undefined} kassaId={report}
        />
        <div className="flex-1 min-h-0 overflow-auto scrollCastom mt-[10px]">
          <CashflowList items={flatData as any} isLoading={isLoading} gap={10} />
          <div ref={loadMoreRef} className="h-[1px]" />
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-[10px]">
              <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
