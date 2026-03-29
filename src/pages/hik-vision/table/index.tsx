import { useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import { FilialColumns } from "./columns";
import Filters from "./filters";
import useLogTime from "./queries";

export default function Page() {
  const [filial] = useQueryState("filial");

  const { data, isLoading } = useLogTime({
    queries: {
      filial: filial || undefined,
    },
  });
  return (
    <>
      <Filters />

      <DataTable
        className="m-4"
        isLoading={isLoading}
        columns={FilialColumns}
        data={data ?? []}
      />
    </>
  );
}
