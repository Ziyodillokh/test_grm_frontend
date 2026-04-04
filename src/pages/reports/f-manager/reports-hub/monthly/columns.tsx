import { ColumnDef } from "@tanstack/react-table";
import { MonthsArray } from "@/consts";
import { TData } from "../../report/type";
import { Badge } from "@/components/ui/badge";
import { getKassaDisplayStatus, kassaStatusConfig } from "./utils";

export const MonthlyColumns: ColumnDef<TData>[] = [
  {
    id: "month",
    header: "Oy",
    cell: ({ row }) => {
      const item = row.original;
      const month = (item as any)?.month;
      const monthName = month ? MonthsArray[month - 1]?.label : "—";
      return <p className="font-medium">{monthName}</p>;
    },
  },
  {
    id: "status",
    header: "Holat",
    cell: ({ row }) => {
      const item = row.original;
      const displayStatus = getKassaDisplayStatus(item);
      const config = kassaStatusConfig[displayStatus] || kassaStatusConfig.open;
      return (
        <Badge variant="outline" className={`rounded-[63px] py-[6px] px-[12px] text-[12px] ${config.className}`}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "totalSum",
    header: "Umumiy summa",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.totalSum ? item.totalSum.toFixed(2) + " $" : "—"}</p>;
    },
  },
  {
    id: "income",
    header: "Kirim",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.income ? item.income + " $" : "—"}</p>;
    },
  },
  {
    id: "expense",
    header: "Chiqim",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.expense ? item.expense + " $" : "—"}</p>;
    },
  },
  {
    id: "sale",
    header: "Sotuv",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.sale ? item.sale + " $" : "—"}</p>;
    },
  },
  {
    id: "plasticSum",
    header: "Terminal",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.plasticSum ? item.plasticSum + " $" : "—"}</p>;
    },
  },
  {
    id: "discount",
    header: "Chegirma",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.discount ? item.discount + " $" : "—"}</p>;
    },
  },
  {
    id: "cash_collection",
    header: "Inkassatsiya",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>{item?.cash_collection ? item.cash_collection + " $" : "—"}</p>
      );
    },
  },
  {
    id: "in_hand",
    header: "Qo'lda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p
          className={
            (item?.in_hand || 0) >= 0 ? "text-[#89A143]" : "text-red-500"
          }
        >
          {item?.in_hand != null ? item.in_hand.toFixed(2) + " $" : "—"}
        </p>
      );
    },
  },
];
