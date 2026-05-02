import { ColumnDef } from "@tanstack/react-table";
import { MonthsArray } from "@/consts";
import { TData } from "../../report/type";

export const SalesColumns: ColumnDef<TData>[] = [
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
    id: "totalSellCount",
    header: "Sotuv soni",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.totalSum != null ? (row.original as any)?.totalSellCount || "—" : "—"}</p>;
    },
  },
  {
    id: "totalSize",
    header: "Hajm (m\u00B2)",
    cell: ({ row }) => {
      const item = row.original;
      return <p>{item?.totalSize ? item.totalSize + " m\u00B2" : "—"}</p>;
    },
  },
  {
    id: "sale",
    header: "Sotuv summasi",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#89A143]">
          {item?.sale ? item.sale + " $" : "—"}
        </p>
      );
    },
  },
  {
    id: "saleReturn",
    header: "Qaytarish",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-red-500">
          {item?.saleReturn ? item.saleReturn + " $" : "—"}
        </p>
      );
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
    id: "additionalProfitSum",
    header: "Qo'shimcha foyda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {item?.additionalProfitSum
            ? item.additionalProfitSum + " $"
            : "—"}
        </p>
      );
    },
  },
  {
    id: "netProfitSum",
    header: "Sof foyda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#89A143]">
          {item?.netProfitSum ? item.netProfitSum + " $" : "—"}
        </p>
      );
    },
  },
];
