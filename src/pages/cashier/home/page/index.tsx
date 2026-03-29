import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { IOpenKassa } from "@/types/api-type";

import Content from "./content";
import useOrder from "./queries";
import CashierHeader from "@/layouts/main-layout/cashier-header";
import Filters from "./filter";

export default function Page() {
  const { meUser } = useMeStore();
  const [sort] = useQueryState("sort");
  const [sellerId] = useQueryState("sellerId");
  const [startDate] = useQueryState("startDate");
  const [endDate] = useQueryState("endDate");

  const { data: kassa } = useQuery({
    queryKey: [apiRoutes.filial],
    queryFn: () =>
      getByIdData<IOpenKassa, void>(
        "/kassa/open-kassa",
        meUser?.filial?.id || ""
      ),
    enabled: !!meUser?.filial?.id,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrder({
    id: kassa?.id ? kassa?.id : undefined,
    queries: {
      status: sort === "all" ? undefined : sort || undefined,
      sellerId: sellerId === "all" ? undefined : sellerId || undefined,
      limit: 10,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
    <CashierHeader>
      <Filters/>
    </CashierHeader>
      <Content
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        orderList={flatData}
      />
    </>
  );
}
