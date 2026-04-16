import { ColumnDef } from "@tanstack/react-table";
import formatPrice from "@/utils/formatPrice";

export const filialColumns: ColumnDef<any>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Filial",
    cell: ({ row }) => (
      <p className="font-medium">{row.original?.filialTitle}</p>
    ),
  },
  {
    header: "Qarzlar",
    cell: ({ row }) => (
      <p className="text-[#FF6600] font-medium">
        {formatPrice(row.original?.totalOwed || 0)} $
      </p>
    ),
  },
  {
    header: "Qaytarilgan",
    cell: ({ row }) => (
      <p className="text-[#89A143] font-medium">
        {formatPrice(row.original?.totalGiven || 0)} $
      </p>
    ),
  },
  {
    header: "Qoldiq",
    cell: ({ row }) => (
      <p className="font-bold">
        {formatPrice(row.original?.balance || 0)} $
      </p>
    ),
  },
  {
    header: "Clientlar",
    cell: ({ row }) => <p>{row.original?.clientCount || 0}</p>,
  },
];

export const clientColumns: ColumnDef<any>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Ism",
    cell: ({ row }) => (
      <p className="font-medium">{row.original?.fullName}</p>
    ),
  },
  {
    header: "Telefon",
    cell: ({ row }) => <p>{row.original?.phone}</p>,
  },
  {
    header: "Qarzlar",
    cell: ({ row }) => (
      <p className="text-[#FF6600] font-medium">
        {formatPrice(row.original?.owed || 0)} $
      </p>
    ),
  },
  {
    header: "Qaytarilgan",
    cell: ({ row }) => (
      <p className="text-[#89A143] font-medium">
        {formatPrice(row.original?.given || 0)} $
      </p>
    ),
  },
  {
    header: "Qoldiq",
    cell: ({ row }) => (
      <p className="font-bold">
        {formatPrice(row.original?.balance || 0)} $
      </p>
    ),
  },
];

export const orderColumns: ColumnDef<any>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Kolleksiya",
    cell: ({ row }) => (
      <p className="font-medium">
        {row.original?.product?.bar_code?.collection?.title || "-"}
      </p>
    ),
  },
  {
    header: "Model",
    cell: ({ row }) => (
      <p>{row.original?.product?.bar_code?.model?.title || "-"}</p>
    ),
  },
  {
    header: "Razmer",
    cell: ({ row }) => (
      <p>{row.original?.product?.bar_code?.size?.title || "-"}</p>
    ),
  },
  {
    header: "Kv",
    cell: ({ row }) => <p>{Number(row.original?.kv || 0).toFixed(2)}</p>,
  },
  {
    header: "Narx",
    cell: ({ row }) => (
      <p className="font-medium">
        {formatPrice(row.original?.price || 0)} $
      </p>
    ),
  },
  {
    header: "Sotuvchi",
    cell: ({ row }) => (
      <p>
        {row.original?.seller?.firstName || ""}{" "}
        {row.original?.seller?.lastName || ""}
      </p>
    ),
  },
  {
    header: "Sana",
    cell: ({ row }) => (
      <p>
        {row.original?.date
          ? new Date(row.original.date).toLocaleDateString("ru-RU")
          : "-"}
      </p>
    ),
  },
];
