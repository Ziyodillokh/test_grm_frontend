import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "@/pages/deller/table/queries";

import { collactionColumns, ListColumns } from "./columns";
import Filters from "./filters";
import { TData } from "@/pages/deller/type";
import { TransferCollectionDealerData, TransferDealerData } from "../type";
import useTransferDealersFetch, { usePackageById } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import ActionBadge from "@/components/actionBadge";

const EXCLUDED_STATUSES = ["Rejected", "Returned"];

const buildFlatList = (data: TransferDealerData[]) => {
  if (!data || !data.length) return [];
  const result: any[] = [];
  let lastGroup: string | null = null;
  let headerIndex = -1;
  let counter = 0;

  for (const item of data) {
    if (!item) continue;
    const group = item.group || "";
    if (group !== lastGroup) {
      result.push({
        type: "header",
        transferer: item?.transferer || {},
        courier: item?.courier || {},
        group: group,
        activeCount: 0,
        activeKv: 0,
      });
      headerIndex = result.length - 1;
      lastGroup = group;
      counter = 0;
    }
    counter++;
    result.push({ ...item, number: counter });

    const status = (item as any)?.progres || (item as any)?.progress || "";
    if (!EXCLUDED_STATUSES.includes(status) && headerIndex >= 0) {
      result[headerIndex].activeCount += Number((item as any)?.count || 0);
      result[headerIndex].activeKv += Number((item as any)?.kv || 0);
    }
  }

  return result;
};
export default function TrasferDealerSinglePage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(50));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [mode] = useQueryState("mode", parseAsString.withDefault("list"));
  const [search] = useQueryState("search");
  const { package_id } = useParams();
  const navigate = useNavigate();
  const { data: filialData } = useDataFetch({
    queries: {
      limit,
      page,
    },
  });

  const flatDataFilial =
    filialData?.pages?.flatMap((page) => page?.items) || [];
  const [filial, setFilial] = useQueryState(
    "filial",
    parseAsString.withDefault(
      flatDataFilial?.filter((i) => i.type === "filial")?.[0]?.id || ""
    )
  );
  const { data: pkgData } = usePackageById(package_id);
  const pkg = pkgData;

  const statusMap: Record<string, string> = {
    progress: "inprogress",
    accepted: "accepted",
    rejected: "rejected",
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransferDealersFetch({
      queries: {
        limit: 10,
        page: 1,
        search: search || undefined,
        package_id,
        mode,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const onSelectFilial = (data: TData) => {
    setFilial(data?.id);
    navigate(`/d-manager/transfer?filial=${data?.id}`);
  };

  return (
    <div className="grid grid-cols-12 gap-2 h-full">
      <div className="col-span-2  max-h-[calc(100vh-100px)] scrollCastom flex gap-2">
        <div className={`w-full h-full  `}>
          <div className="w-full flex h-[64px] items-center justify-between  border-solid  p-[21.22px] rounded-lg bg-sidebar">
            <h4 className="text-[14px] font-semibold  text-foreground">
              Дилеры
            </h4>
          </div>

          <div className={`p-3 px-0 mx-5  `}>
            {flatDataFilial
              ?.filter((i) => i.type === "dealer")
              .map((e) => (
                <button
                  key={e?.id}
                  onClick={() => onSelectFilial(e)}
                  className={`${filial === e.id ? "bg-sidebar" : ""} rounded-lg group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar px-3  py-2.5`}
                >
                  {e.title}
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-10">
        {pkg && (
          <div className="flex items-center gap-4 mb-2 px-4 py-3 bg-sidebar rounded-lg">
            <h3 className="text-sm font-semibold">{pkg.title || "Пакет"}</h3>
            <ActionBadge status={statusMap[pkg.status] || pkg.status} />
            <div className="flex gap-4 ml-auto text-sm text-muted-foreground">
              <span>{pkg.total_count || 0} шт</span>
              <span>{Number(pkg.total_kv || 0).toFixed(2)} м²</span>
              {Number(pkg.total_sum || 0) > 0 && (
                <span className="font-medium text-foreground">{Number(pkg.total_sum || 0).toFixed(2)} $</span>
              )}
            </div>
          </div>
        )}
        <Filters />
        {mode == "collection" ? (
          <DataTable
            isLoading={isLoading}
            className="max-h-[calc(100vh-140px)]   scrollCastom"
            columns={collactionColumns}
            data={(flatData || []) as unknown as TransferCollectionDealerData[]}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            ischeckble={false}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <DataTable
            isLoading={isLoading}
            className="max-h-[calc(100vh-140px)]  scrollCastom"
            columns={ListColumns}
            data={buildFlatList(flatData) as unknown as TransferDealerData[]}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            ischeckble={false}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}
