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
    id: "return_sale",
    header: "Qaytarish",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-red-500">
          {item?.return_sale ? item.return_sale + " $" : "—"}
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
    id: "additionalProfitTotalSum",
    header: "Qo'shimcha foyda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {item?.additionalProfitTotalSum
            ? item.additionalProfitTotalSum + " $"
            : "—"}
        </p>
      );
    },
  },
  {
    id: "netProfitTotalSum",
    header: "Sof foyda",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#89A143]">
          {item?.netProfitTotalSum ? item.netProfitTotalSum + " $" : "—"}
        </p>
      );
    },
  },
];
