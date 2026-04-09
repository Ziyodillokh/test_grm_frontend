import { DataTable } from "@/components/ui/data-table";
// import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import { SellerReportsColumns } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import { useDataSellerReports } from "./queries";
import { getMonth } from "date-fns";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";

export default function PageSellerReport() {
  const { meUser } = useMeStore();
  const { year } = useYear()
  const navigate = useNavigate();

  const [month] = useQueryState("month", parseAsString.withDefault(getMonth(new Date()) + 1 + ""));
  const [filial] = useQueryState("filial");
  const {
    data: SellerReportsData,
    isLoading: SellerReportsLoading,
    fetchNextPage: SellerReportsfetchNextPage,
    hasNextPage: SellerReportsfhasNextPage,
    isFetchingNextPage: SellerReportsisFetchingNextPage,
  } = useDataSellerReports({
    queries: {
      filialId:
        meUser?.position?.role == 4 ? meUser?.filial?.id : filial || "all",
      page: 1,
      limit: 10,
      month: month || undefined,
      year,
    },
  });

  const flatSellerReportsData =
    SellerReportsData?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={SellerReportsColumns || []}
          data={flatSellerReportsData}
          isLoading={SellerReportsLoading}
          isRowClickble={false}
          onRowClick={(row) => {
            const name = encodeURIComponent(row?.firstName + " " + row?.lastName);
            navigate(`${row?.id}/info?month=${month}&userName=${name}`);
          }}
          fetchNextPage={SellerReportsfetchNextPage}
          hasNextPage={SellerReportsfhasNextPage ?? false}
          isFetchingNextPage={SellerReportsisFetchingNextPage}
        />
      </div>
    </>
  );
}
