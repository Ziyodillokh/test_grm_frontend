import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";

import { Columns } from "./columns";
import useDataFetch from "./queries";
import { useParams } from "react-router-dom";
import Filters from "./filter";
import { useMeStore } from "@/store/me-store";

export default function SingleReportPage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search] = useQueryState("search");
  const [,setReportStatus] = useQueryState("reportStatus");
  const { id } = useParams();
  const {meUser} = useMeStore()
  const { data, isLoading } = useDataFetch({
    queries: {
      limit,
      page,
      search: search || undefined,
      filialId: id == "my-filial" ?meUser?.filial?.id:id || undefined,
    },
  });

  return (
    <div className="w-full">
      <Filters />
      <DataTable
        isRowClickble={true}
        isLoading={isLoading}
        onRowClick={(row:{status:string})=>setReportStatus(row?.status.toLocaleLowerCase())}
        columns={Columns}
        data={data?.items || []}
      />
    </div>
  );
}
