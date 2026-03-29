import { ColumnDef } from "@tanstack/react-table";
import {
  Delete,
  MessageSquareText,
  Minus,
  MoreHorizontal,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import { format } from "date-fns";
import { TData } from "./type";

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
            item?.type === "Приход" ? (
              <ShoppingCart className={`h-6 w-6`} />
            ) : (
              <Delete className={`h-6 w-6`} />
            )
          ) : item?.type === "Приход" ? (
            <Plus className="h-6 w-6 " />
          ) : (
            <Minus className="h-6 w-6" />
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
        <span
          className={`font-bold text-nowrap  text-[16px] ${item.type === "Приход" ? "text-[#89A143]" : "text-[#E38157]"}`}
        >
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
    id: "time",
    header: "Дата",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] min-w-[80px]">
          {format(item?.date, "dd MMM HH:mm")}
        </p>
      );
    },
  },
  {
    id: "comment",
    header: "Подробнее информации",
    cell: ({ row }) => {
      const item = row.original;
      <p className="text-[13px] text-muted-foreground flex gap-1">
        {item?.comment && <MessageSquareText width={14} />}
        {item?.product || item?.comment}
      </p>
    },
  },

  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];