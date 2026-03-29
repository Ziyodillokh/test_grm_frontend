import { ColumnDef } from "@tanstack/react-table";

import { TData } from "./type";
import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import {
  MessageSquareText,
  SquareArrowOutDownLeft,
  SquareArrowOutUpRight,
} from "lucide-react";
import { format } from "date-fns";
import TebleAvatar from "@/components/teble-avatar";

export const Columns: ColumnDef<TData>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.type === "Приход" ? "bg-[#85D188] text-white" : "bg-[#FFACAC] text-white"}`}
        >
          {item?.type === "Приход" ? (
            <SquareArrowOutDownLeft className="h-5 w-5 " />
          ) : (
            <SquareArrowOutUpRight className="h-6 w-6" />
          )}
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
        <span className={`font-bold text-nowrap text-nowrap  text-[16px] `}>
          {item?.type === "Приход" ? "+" : "-"}
          {formatPrice(item?.price || 0)}$
        </span>
      );
    },
  },
  {
    id: "type",
    header: "Тип",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div>
          <Button
            className={`${item?.type !== "Приход" ? "text-[#FFACAC] border-[#FFACAC] hover:text-[#FFACAC]" : "text-[#85D188] border-[#85D188] hover:text-[#85D188]"} bg-white  rounded-[70px] p-[14px] h-10 `}
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
        <p className="text-[13px] max-w-[200px] overflow-hidden text-[#B5B5B5] flex gap-1">
          {item?.comment && <MessageSquareText width={14} />}
          {item?.comment}
        </p>
      );
    },
  },
  {
    id: "time",
    header: "Дата",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] min-w-[80px] text-[#B5B5B5]">
          {format(item?.date, "dd MMM HH:mm")}
        </p>
      );
    },
  },
  {
    header: "Продавец",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return <TebleAvatar status={"none"} name={item?.casher?.firstName} url={item?.casher?.avatar?.path} />

    },
  },
];
