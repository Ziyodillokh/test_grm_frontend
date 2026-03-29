import { useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import { KassaColumnsLoc } from "./columns";
import Filter from "./filter";
import CardSort from "@/components/card-sort";
import { useClientdebtTotal, useKassaReports } from "./queries";
import { useState } from "react";
import { useKassaReportTotal } from "../report/queries";
import { useYear } from "@/store/year-store";

export default function PageFinance() {
  const { meUser } = useMeStore();
  const { year } = useYear();
  const [filial] = useQueryState("filial");
  const [seleted, setSeleted] = useState<string[]>([]);
  const { data: KassaReport } = useKassaReportTotal({
    queries: {
      filialId: meUser?.filial?.id || "",
    },
    enabled: Boolean(meUser?.filial?.id),
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKassaReports({
      queries: {
        year: year || undefined,
        filialId:
          meUser?.position?.role == 10 || meUser?.position?.role == 9
            ? filial || undefined
            : meUser?.filial?.id || undefined,
      },
    });
    

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const {data:ClientdebtTotal} =useClientdebtTotal({
    id: meUser?.filial?.id  ||""
  })

  return (
    <>
    
      <Filter  setSeleted={setSeleted} />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <CardSort KassaReport={KassaReport} ClientdebtTotal={ClientdebtTotal} />
        <DataTable
          columns={KassaColumnsLoc}
          data={flatData.length ? flatData : []}
          isLoading={isLoading}
          isRowClickble={true}
          onSelectionChange={(e) => {
            const newIds = e.map((item) => item.id);
            if (JSON.stringify(seleted) != JSON.stringify(newIds)) {
              setSeleted(newIds);
            }
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
