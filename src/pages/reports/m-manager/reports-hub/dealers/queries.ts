import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { DealerReportResponse, DealerReportQuery } from "./type";

interface IDealerReportQuery {
  queries?: DealerReportQuery;
  enabled?: boolean;
}

export const useDealerReport = ({
  queries,
  enabled = true,
}: IDealerReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.dealerReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<DealerReportResponse, DealerReportQuery>(apiRoutes.dealerReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });
