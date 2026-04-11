import { ColumnDef } from "@tanstack/react-table";
import formatPrice from "@/utils/formatPrice";
import { FactoryReportItem } from "./type";

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

