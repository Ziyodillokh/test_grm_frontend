import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { DealerDetailResponse, DealerDetailQuery } from "./type";

interface IDealerDetailQuery {
  dealerId: string;
  queries?: DealerDetailQuery;
  enabled?: boolean;
}

export const useDealerKassaDetail = ({
  dealerId,
  queries,
  enabled = true,
}: IDealerDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.dealerKassaDetail, dealerId, "detail", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<DealerDetailResponse, DealerDetailQuery>(
        `${apiRoutes.dealerKassaDetail}/${dealerId}`,
        {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit || 50,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    enabled: enabled && !!dealerId,
    initialPageParam: 1,
  });
