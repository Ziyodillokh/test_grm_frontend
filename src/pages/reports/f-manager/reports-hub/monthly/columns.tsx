import { ColumnDef } from "@tanstack/react-table";
import ActionBadge from "@/components/actionBadge";
import { MonthsArray } from "@/consts";
import { TData } from "../../report/type";

export const MonthlyColumns: ColumnDef<TData>[] = [
  {
    id: "month",
    header: "Oy",
    cell: ({ row }) => {
      const item = row.original;
      const month = item?.startDate
        ? new Date(item.startDate).getMonth()
        : undefined;
      const monthName =
        month !== undefined ? MonthsArray[month]?.label : "—";
      return <p className="font-medium">{monthName}</p>;
    },
  },
  {
    id: "status",
    header: "Holat",
    cell: ({ row }) => {
      const item = row.original;
      const statusMap: Record<string, string> = {
        open: "inProgress",
        warning: "inProgress",
        closed_by_c: "panding",
        accepted: "success",
        rejected: "fail",
      };
      return (
        <ActionBadge
          status={
            statusMap[item?.status] || item?.status || "inProgress"
          }
        />
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
