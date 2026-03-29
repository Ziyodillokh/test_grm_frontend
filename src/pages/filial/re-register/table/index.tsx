import { DataTable } from "@/components/ui/data-table";

import ActionPageQrCode from "../form";
import { Columns, ColumnsColaction } from "./columns";
// import Filter from "./filter";
import { useParams } from "react-router-dom";
import useDataFetch, { usePartiyaReport } from "./queries";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useMeStore } from "@/store/me-store";
// import { usePartiyaById } from "../../form/actions";
import { TReportData } from "../type";
import Filters from "./filter";

function ItemBottom({ items }: { items: TReportData }) {
  return (
    <div className="w-full flex items-center  justify-start pr-10 border-border border-t  bg-sidebar">
      <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
        Количество: {Number(items?.count)?.toFixed(0) || 0}
      </div>
      <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
        Объем: {Number(items?.volume)?.toFixed(2) || 0} м²
      </div>

      <div className="py-[14px] text-[#5D5D53] text-[13px] font-normal  border-border border-l px-[18px]">
        Сумма: {Number(items?.total)?.toFixed(2) || 0} $
      </div>
    </div>
  );
}

export default function ItemsPage() {
  const [search] = useQueryState("search");
  const { filialReportId } = useParams();
  const { meUser } = useMeStore();
  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault(
      meUser?.position?.role == 7 || meUser?.position.role == 4
        ? "переучет"
        : "new"
    )
  );

  const [type] = useQueryState("type", parseAsString.withDefault("default"));
  const [, setBarCode] = useQueryState("barcode");
  const [, setProductId] = useQueryState("productId");

  // const { data: onePartiya } = usePartiyaById({
  //   id: id ? id : undefined,
  //   queries: {
  //     populate: "*",
  //   },
  // });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataFetch({
      id: filialReportId || "",
      queries: {
        search: search || undefined,
        // type: type || "default",
        type: tip == "new" ? undefined : tip || undefined,
      },
    });

  const {
    data: BottomData,
    isLoading: BottomIsLoading,
    fetchNextPage: BottomFetchNextPage,
    hasNextPage: BottomHasNextPage,
    isFetchingNextPage: BottomIsFetchingNextPage,
  } = useDataFetch({
    id: filialReportId || "",
    queries: {
      search: search || undefined,
      // type: tip || "default",
      type: "дефицит",
    },
    enabled: Boolean(tip == "излишки"),
  });

  const { data: PartiyaReportData } = usePartiyaReport({
    id: filialReportId || "",
    queries: {
      type: tip == "new" ? undefined : tip || undefined,
    },
  });

  const { data: BootomPartiyaReportData } = usePartiyaReport({
    id: filialReportId || "",
    queries: {
      type: "дефицит",
    },
    enabled: Boolean(tip == "излишки"),
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const BottomflatData =
    BottomData?.pages?.flatMap((page) => page?.items || []) || [];
  const LocalColums = useMemo(() => {
    if (type == "collection") {
      if (meUser?.position.role == 7 || meUser?.position.role == 4) {
        return ColumnsColaction.filter(
          (col) =>
            col.header !== "Сумма" &&
            col.header !== "Зав.цена" &&
            col.header !== "Расход"
        );
      } else {
        return ColumnsColaction;
      }
    } else {
      return Columns;
    }
  }, [type]);

  return (
    <div className="flex w-full">
      <ActionPageQrCode />
      <div className="w-2/3">
        <Filters />
        <DataTable
          onRowClick={(e) => {
            if (type == "default") {
              setBarCode(e?.bar_code?.code);
              setProductId(e?.id);
            }
          }}
          isLoading={isLoading}
          columns={LocalColums}
          ischeckble={false}
          isNumberble={true}
          className={
            tip == "излишки"
              ? "h-[calc(50vh-118px)] scrollCastom"
              : "h-[calc(100vh-183px)] scrollCastom"
          }
          data={flatData || []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />

        {PartiyaReportData ? <ItemBottom items={PartiyaReportData} /> : ""}
        {tip == "излишки" && (
          <DataTable
            isLoading={BottomIsLoading}
            columns={LocalColums}
            ischeckble={false}
            isNumberble={true}
            className={
              tip == "излишки"
                ? "h-[calc(50vh-110px)]  scrollCastom"
                : "h-[calc(100vh-165px)] scrollCastom"
            }
            data={BottomflatData || []}
            fetchNextPage={BottomFetchNextPage}
            hasNextPage={BottomHasNextPage ?? false}
            isFetchingNextPage={BottomIsFetchingNextPage}
          />
        )}
        {BootomPartiyaReportData && tip == "излишки" ? (
          <ItemBottom items={BootomPartiyaReportData} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
