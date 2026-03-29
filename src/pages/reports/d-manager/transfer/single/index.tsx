import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "@/pages/deller/table/queries";

import { collactionColumns, ListColumns } from "./columns";
import Filters from "./filters";
import { TData } from "@/pages/deller/type";
import { TransferCollectionDealerData, TransferDealerData } from "../type";
import useTransferDealersFetch from "./queries";
import { useNavigate, useParams } from "react-router-dom";

const buildFlatList = (data:TransferDealerData[]) => {
  const result = [];
  let lastDate = null;
  let counter = 0; 

  for (const item of data) {
    const group = item.group;
    if (group !== lastDate) {
      result.push({ type: 'header',transferer:item?.transferer,courier:item?.courier ,group: group });
      lastDate = group;
      counter = 0; 
    }
    counter++; 
    result.push({
      ...item,
      number: counter, // add number field
    });
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
        <Filters />
        {mode == "collection" ? (
          <DataTable
            isLoading={isLoading}
            className="max-h-[calc(100vh-140px)]   scrollCastom"
            columns={collactionColumns}
            data={flatData as unknown as TransferCollectionDealerData[]}
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
