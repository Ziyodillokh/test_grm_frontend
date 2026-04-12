import { ColumnDef } from "@tanstack/react-table";
import formatPrice from "@/utils/formatPrice";
import { DealerReportItem } from "./type";

export const DealerColumns: ColumnDef<DealerReportItem>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Nomi",
    cell: ({ row }) => (
      <p className="font-medium">{row.original?.title}</p>
    ),
  },
  {
    header: "Qarzi",
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
    header: "Qoldig'i",
    cell: ({ row }) => (
      <p className="font-bold">
        {formatPrice((row.original?.owed || 0) - (row.original?.given || 0))} $
      </p>
    ),
  },
];
