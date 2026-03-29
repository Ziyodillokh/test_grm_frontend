import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import ActionPage from "../form";
import { BonusColumns } from "./columns";
import Filters from "./filters";
import useBonusData from "./queries";

export default function Page() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const { meUser } = useMeStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBonusData({
      queries: {
        limit,
        page,
        search: search || undefined,
        filial: meUser?.filial?.id || undefined,
      },
    });
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  return (
    <>
      <Filters />
      <DataTable
        className="m-4"
        isLoading={isLoading}
        columns={BonusColumns}
        isNumberble
        ischeckble={false}
        // className={'max-h-screen overflow-y-scroll'}
          // @ts-ignore
        data={flatData ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
      <ActionPage />
    </>
  );
}
