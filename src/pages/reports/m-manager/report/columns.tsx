import { ColumnDef } from "@tanstack/react-table";
import {
  Delete,
  MessageSquareText,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import { format } from "date-fns";
import { TData } from "./type";
import TebleAvatar from "@/components/teble-avatar";
import TableAction from "@/components/table-action";
import { parseAsBoolean, useQueryState } from "nuqs";
import { apiRoutes } from "@/service/apiRoutes";

export const Columns: ColumnDef<TData>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-12 h-12 flex items-center justify-center ${item.type === "Приход" ? "bg-[#89A143] text-white" : "bg-[#E38157] text-white"}`}
        >
          {item?.tip === "order" ? (
            item?.type === "Приход" ?
              <ShoppingCart className={`h-6 w-6`} /> :
              <Delete className={`h-6 w-6`} />

          ) :
            item?.type === "Приход" ? <Plus className="h-6 w-6 " /> : <Minus className="h-6 w-6" />
          }
        </div>
      );
    },
  },
  {
    id: "price",
    header: "Наличие",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span
          className={`font-bold text-nowrap  text-[16px] text-nowrap ${item.type === "Приход" ? "text-[#89A143]" : "text-[#E38157]"}`}
        >
          {item?.type === "Приход" ? "+" : "-"}
          {item?.tip == "order" && item?.type != "Расход" ? formatPrice(item?.order?.price || 0) : formatPrice(item?.price || 0)}$
        </span>
      );
    },
  },
  {
    id: "terminal",
    header: "Терминал",
    cell: ({ row }) => {
      const item = row.original;
      return (
        item.type === "Приход" ?
          <span
            className={`font-bold text-[16px]  text-[#58A0C6]`}
          >
            {formatPrice(item?.order?.plasticSum || 0)}$
          </span> : ""
      );
    },
  },
  {
    id: "type",
    header: "Тип",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div >
          <Button
            className={`${item?.type !== "Приход" ? "text-[#E38157] border-[#E38157] hover:text-[#E38157]" : "text-[#89A143] border-[#89A143] hover:text-[#89A143]"}  rounded-[70px] p-[14px] h-10 `}
            variant={"outline"}
          >
            {item?.cashflow_type?.title}
          </Button>
        </div>
      );
    },
  },
  {
    id: "comment",
    header: "Подробнее информации",
    cell: ({ row }) => {
      const item = row.original;
      return (
        item.tip == "cashflow" ? <p className="text-[13px] text-muted-foreground flex gap-1">
          {item?.comment && <MessageSquareText width={14} />}
          {item?.product || item?.comment}
        </p> :
          <div className="flex  items gap-10 xl:gap-14">
            <p className="text-[13px] text-muted-foreground">
              {item.order?.bar_code?.collection?.title}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {item.order?.bar_code?.model?.title}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {item?.tip === "order" && item?.order?.bar_code?.size?.title}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {item?.tip === "order" && item?.order?.bar_code?.color?.title}
            </p>
          </div>
      );
    },
  },

  {
    id: "quantity",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-muted-foreground">
          {row.original?.tip === "order" && item?.order?.x ?
            ` ${item?.order?.x} ${item?.order?.bar_code?.isMetric ? "" : "x"}`
            :
            ""}

        </p>
      );
    },
  },
  {
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] min-w-[60px] text-[#E38157]">
          {item?.tip === "order" && item?.order?.discountPercentage && item?.order?.discountPercentage != "0" && `-${item?.order?.discountSum} $`}
        </p>
      );
    },
  },


  {
    id: "filial",
    header: "Филиал",
    cell: ({ row }) => {
      const item = row.original;
      return (
        item?.filial?.name ?
          <Button
            className={`bg-[#E6E6D9] border-0  rounded-[5px] p-[14px] h-10 `}
            variant={"outline"}
          >
            {item?.filial?.name}
          </Button>
          : ""
      );
    },
  },
  {
    header: "Продавец",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;

      return item?.order?.seller && < TebleAvatar status="success" name={item?.order?.seller?.fatherName} url={item?.order?.seller?.avatar?.path} />
    },
  },
  {
    header: "Кассир",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return <TebleAvatar status={item?.order?.status == "rejected" ? "fail" : "success"} name={item?.casher?.fatherName} url={item?.casher?.avatar?.path} />

    },
  },
  {
    id: "time",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[13px] min-w-[80px]">{format(item?.date, "dd MMM HH:mm")}</p>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [myCashFlow] = useQueryState(
        "myCashFlow",
        parseAsBoolean.withDefault(false)
      );
      return (
        <TableAction
          ShowDelete={myCashFlow}
          ShowUpdate={false}
          url={apiRoutes.cashflow}
          refetchUrl={apiRoutes.cashflow}
          id={row?.original?.id + ""}
        />
      )
    },
  },
];

