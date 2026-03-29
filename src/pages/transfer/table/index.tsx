import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import useDataFetch from "@/pages/deller/table/queries";
import { useMeStore } from "@/store/me-store";

import { collactionColumns, paymentColumns } from "./columns";
import Filters from "./filters";
import useTransfers from "./queries";
import { TransferData } from "../type";
import { TData } from "@/pages/deller/type";

const buildFlatList = (data: TransferData[]) => {
  const result = [];
  let lastDate = null;
  let counter = 0;

  for (const item of data) {
    const group = item.group;
    if (group !== lastDate) {
      result.push({ type: 'header', transferer: item?.transferer, courier: item?.courier, group: group });
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

export default function Page() {
  const { meUser } = useMeStore();
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(50));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [search] = useQueryState("search")
  const [progressStatus, setProgressStatus] = useQueryState("progress", parseAsString.withDefault('all'))


  const [fromDate] = useQueryState<Date>("startDate", { parse: () => null });
  const [toDate] = useQueryState<Date>("endDate", { parse: () => null });

  const progestingInObj = {
    all: {},
    New: { 1: "Accepted", 2: "Rejected" },
    Accepted: { 1: "Accepted_F", 2: "Rejected" },
    Rejected: { 1: "Accepted_F", 2: "Accepted" },
  }

  const progestingOutObj = {
    all: undefined,
    InProgres: { 0: "Accepted", 1: "Accepted_F", 2: "Rejected" },
    Accepted: { 0: "Processing", 1: "Accepted_F", 2: "Rejected" },
    Rejected: { 0: "Processing", 1: "Accepted_F", 2: "Accepted" },
  }
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
  const [filialTo, setFilialTo] = useQueryState(
    "filialTo",
    parseAsString.withDefault(
      flatDataFilial?.filter((i) => i.type === "filial")?.[1]?.id || ""
    )
  );
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("In")
  )
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransfers({
    queries: {
      limit: 10,
      page: 1,
      from: meUser?.position.role === 9 ? filial : type == "In" ? filial : meUser?.filial?.id,
      to: meUser?.position.role === 9 ? filialTo : type == "In" ? meUser?.filial?.id : filial,
      startDate: fromDate || undefined,
      endDate: toDate || undefined,
      search: search || undefined,
      /* @ts-ignore */
      progress: type == "In" ? { 0: "Processing", ...progestingInObj?.[progressStatus] } : progestingOutObj?.[progressStatus]
    },
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const onSelectFilial = (data: TData) => {
    setFilial(data?.id)
    // setSearch(null)
  }
  return (
    <div className="grid border border-border rounded-[12px] overflow-hidden grid-cols-12 h-full">
      <div className="col-span-4    flex">
        <div className={`w-full h-full border-r border-border `}>
          <div className="w-full flex h-[64px] items-center justify-between border-border border-solid border-b p-[21.22px] bg-sidebar">
            <h4 className="text-[14px] font-semibold text-foreground">
              {meUser?.position.role === 9 ? "Из филиал" : "Филиалы"}
            </h4>
          </div>
          <div className="h-[calc(100vh-140px)] scrollCastom">

            {meUser?.position.role !== 6 && (
              <div className="p-1 px-0 mx-3 border-b border-border  pb-5">
                {flatDataFilial
                  ?.filter((i) => i.type === "filial")
                  ?.filter((i) => i.id !== meUser?.filial?.id)
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={meUser?.position.role === 9 ? filialTo === e.id : false}
                      onClick={() => onSelectFilial(e)}
                      className={`${filial === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            )}
            {meUser?.position.role !== 6 && (
              <div className="p-1 px-0 mx-3 border-b border-border">
                {flatDataFilial
                  ?.filter((i) => i.type === "market")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={meUser?.position.role === 9 ? filialTo === e.id : false}
                      onClick={() => onSelectFilial(e)}
                      className={`${filial === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            )}
            {meUser?.position.role != 8 ? <div
              className={`p-3 px-0 mx-3 ${meUser?.position.role !== 6 && "border-b border-border"} `}
            >
              {flatDataFilial
                ?.filter((i) => i.type === "dealer")
                .map((e) => (
                  <button
                    key={e?.id}
                    disabled={filialTo === e.id}
                    onClick={() => onSelectFilial(e)}
                    className={`${filial === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                  >
                    {e.title}
                  </button>
                ))}
            </div> : ""}
            {meUser?.position.role !== 6 && (
              <div className="p-3 px-0 mx-3 ">
                {flatDataFilial
                  ?.filter((i) => i.type === "warehouse")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={filialTo === e.id}
                      onClick={() => onSelectFilial(e)}
                      className={`${filial === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        {meUser?.position.role === 9 ? (
          <div className={`w-full h-full border-r border-border `}>
            <div className="w-full flex h-[64px] items-center justify-between border-border border-solid border-b p-[21.22px] bg-sidebar">
              <h4 className="text-[14px] font-semibold text-foreground">
                В филиал
              </h4>
            </div>
            <div className="max-h-[calc(100vh-140px)] scrollCastom">

              <div className="p-1 px-0 mx-3 border-b border-border pb-1">
                {flatDataFilial
                  ?.filter((i) => i.type === "filial")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={filial === e.id}
                      onClick={() => setFilialTo(e?.id)}
                      className={`${filialTo === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
              <div className="p-1 px-0 mx-3 border-b border-border">
                {flatDataFilial
                  ?.filter((i) => i.type === "market")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={filial === e.id}
                      onClick={() => setFilialTo(e?.id)}
                      className={`${filialTo === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
              <div className="p-1 px-0 mx-3 border-b border-border">
                {flatDataFilial
                  ?.filter((i) => i.type === "dealer")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={filial === e.id}
                      onClick={() => setFilialTo(e?.id)}
                      className={`${filialTo === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
              <div className="p-3 px-0 mx-3 ">
                {flatDataFilial
                  ?.filter((i) => i.type === "warehouse")
                  .map((e) => (
                    <button
                      key={e?.id}
                      disabled={filial === e.id}
                      onClick={() => setFilialTo(e?.id)}
                      className={`${filialTo === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full border-r border-border `}>
            <div className="w-full flex h-[64px] items-center justify-between border-border border-solid border-b p-[21.22px] bg-sidebar">
              <h4 className="text-[14px] font-semibold text-foreground">
                Статус транзакции
              </h4>
            </div>
            <div className="p-3 px-0 mx-3 max-h-[calc(100vh-140px)] scrollCastom">
              {[
                { id: "In", name: "Входящие" },
                { id: "Out", name: "Отправленные" },
                // { id: "New", name: "Новые" },
              ].map((e) => (
                <button
                  key={e?.id}
                  disabled={filial === e.id}
                  onClick={() => {
                    setType(e?.id)
                    setProgressStatus('all')
                  }}
                  className={`${type === e.id ? "bg-sidebar" : ""} group text-foreground flex items-center justify-between  mb-1 text-[14px]  w-full hover:bg-sidebar rounded-[8px] rounded-[8px]] px-3  py-1`}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="col-span-8">
        <Filters />
        <DataTable
          isLoading={isLoading}
          className="max-h-[calc(100vh-140px)] scrollCastom"
          columns={meUser?.position.role == 6 ? collactionColumns : paymentColumns(flatDataFilial)}
          data={meUser?.position.role == 6 ? [{ id: 1 }, { id: 1 }] as unknown as TransferData[] : buildFlatList(flatData) as unknown as TransferData[]}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          ischeckble={false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div >
  );
}
