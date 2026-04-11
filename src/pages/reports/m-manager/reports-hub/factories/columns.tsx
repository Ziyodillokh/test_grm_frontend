import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import { FactoryReportItem, FactoryDetailItem } from "./type";

export const FactoryColumns: ColumnDef<FactoryReportItem>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Zavod",
    cell: ({ row }) => (
      <p className="font-medium">{row.original?.title}</p>
    ),
  },
  {
    header: "Mamlakat",
    cell: ({ row }) => <p>{row.original?.country || ""}</p>,
  },
  {
    header: "Olingan",
    cell: ({ row }) => (
      <p className="text-[#FF6600] font-medium">
        {formatPrice(row.original?.owed || 0)} $
      </p>
    ),
  },
  {
    header: "To'langan",
    cell: ({ row }) => (
      <p className="text-[#89A143] font-medium">
        {formatPrice(row.original?.given || 0)} $
      </p>
    ),
  },
  {
    header: "Qolgan",
    cell: ({ row }) => (
      <p className="font-bold">
        {formatPrice(row.original?.totalDebt || 0)} $
      </p>
    ),
  },
];

export const FactoryDetailColumns: ColumnDef<FactoryDetailItem>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-10 h-10 flex items-center justify-center rounded ${
            item.entry_type === "partiya"
              ? "bg-[#FF6600] text-white"
              : "bg-[#89A143] text-white"
          }`}
        >
          {item.entry_type === "partiya" ? (
            <ArrowDown className="h-5 w-5" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </div>
      );
    },
  },
  {
    id: "date",
    header: "Sana",
    cell: ({ row }) => (
      <p className="text-[13px] min-w-[80px]">
        {format(new Date(row.original?.date), "dd MMM yyyy")}
      </p>
    ),
  },
  {
    id: "type",
    header: "Turi",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span
          className={`text-[13px] font-medium ${
            item.entry_type === "partiya" ? "text-[#FF6600]" : "text-[#89A143]"
          }`}
        >
          {item.entry_type === "partiya" ? "Partiya" : "To'lov"}
        </span>
      );
    },
  },
  {
    id: "collection",
    header: "Kolleksiya",
    cell: ({ row }) => (
      <p className="text-[13px]">{row.original?.collection_title || ""}</p>
    ),
  },
  {
    id: "kv",
    header: "M kv",
    cell: ({ row }) => (
      <p className="text-[13px]">
        {row.original?.total_kv ? formatPrice(row.original.total_kv) : ""}
      </p>
    ),
  },
  {
    id: "price_per_kv",
    header: "Narxi",
    cell: ({ row }) => (
      <p className="text-[13px]">
        {row.original?.price_per_kv
          ? `${formatPrice(row.original.price_per_kv)} $`
          : ""}
      </p>
    ),
  },
  {
    id: "total",
    header: "Summasi",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span
          className={`font-bold text-[15px] ${
            item.entry_type === "partiya" ? "text-[#FF6600]" : "text-[#89A143]"
          }`}
        >
          {formatPrice(item?.total_cost || 0)} $
        </span>
      );
    },
  },
  {
    id: "who",
    header: "Kim to'lagan",
    cell: ({ row }) => (
      <p className="text-[13px]">{row.original?.who_paid || ""}</p>
    ),
  },
  {
    id: "comment",
    header: "Izoh",
    cell: ({ row }) => (
      <p className="text-[13px] text-muted-foreground">
        {row.original?.comment || ""}
      </p>
    ),
  },
];
