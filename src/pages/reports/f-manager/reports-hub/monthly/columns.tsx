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
    id: "cashCollection",
    header: "Inkassatsiya",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>{item?.cashCollection ? item.cashCollection + " $" : "—"}</p>
      );
    },
  },
  {
    id: "inHand",
    header: "Qo'lda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p
          className={
            (item?.inHand || 0) >= 0 ? "text-[#89A143]" : "text-red-500"
          }
        >
          {item?.inHand != null ? item.inHand.toFixed(2) + " $" : "—"}
        </p>
      );
    },
  },
];
