import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import formatPrice from "@/utils/formatPrice";
import type { DayData } from "./type";

export const SellerDailyColumns: ColumnDef<DayData>[] = [
  {
    id: "date",
    header: "Kun",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[14px] font-medium">
          {format(new Date(item.date), "d-MMM", { locale: uz })}
        </p>
      );
    },
  },
  {
    id: "count",
    header: "Soni",
    cell: ({ row }) => <p className="text-[14px]">{row.original.count}</p>,
  },
  {
    id: "kv",
    header: "Hajm",
    cell: ({ row }) => (
      <p className="text-[14px]">{row.original.kv} m²</p>
    ),
  },
  {
    id: "earn",
    header: "Sotuv",
    cell: ({ row }) => (
      <p className="text-[14px] text-[#89A143] font-medium">
        {formatPrice(row.original.earn)}$
      </p>
    ),
  },
  {
    id: "discount",
    header: "Skidka",
    cell: ({ row }) => (
      <p className="text-[14px] text-[#E38157]">
        {row.original.discount > 0 ? `-${formatPrice(row.original.discount)}$` : "—"}
      </p>
    ),
  },
  {
    id: "plastic",
    header: "Terminal",
    cell: ({ row }) => (
      <p className="text-[14px] text-[#58A0C6]">
        {row.original.plastic > 0 ? `${formatPrice(row.original.plastic)}$` : "—"}
      </p>
    ),
  },
];
