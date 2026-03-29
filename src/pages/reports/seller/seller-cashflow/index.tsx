import { DataTable } from "@/components/ui/data-table";
// import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import { SellerCashflowColumns } from "./columns";
import { useDataSellerCashflow } from "./queries";
import { useParams } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useQueryState } from "nuqs";

export default function PageSellerCashFlow() {
  const { id } = useParams()
  const { year } = useYear()
  const [startDate] = useQueryState("startDate")
  const [endDate] = useQueryState("endDate")
  const {
    data: SellerCashflowData,
    isLoading: SellerCashflowLoading,
    fetchNextPage: SellerCashflowfetchNextPage,
    hasNextPage: SellerCashflowfhasNextPage,
    isFetchingNextPage: SellerCashflowisFetchingNextPage,
  } = useDataSellerCashflow({
    queries: {
      sellerId: id || undefined,
      tip: "order",
      year: year,
      fromDate: startDate || undefined,
      toDate: endDate || undefined
    },
  });

  const flatSellerCashflowData =
    SellerCashflowData?.pages?.flatMap((page) => page.items || []) || [];

  return (
    <>
      <Filter data={SellerCashflowData?.pages[0]?.totals || undefined} />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={SellerCashflowColumns || []}
          data={flatSellerCashflowData}
          isLoading={SellerCashflowLoading}
          fetchNextPage={SellerCashflowfetchNextPage}
          hasNextPage={SellerCashflowfhasNextPage ?? false}
          isFetchingNextPage={SellerCashflowisFetchingNextPage}
        />
      </div>
    </>
  );
}
