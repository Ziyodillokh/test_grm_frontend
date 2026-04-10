import { ColumnDef } from "@tanstack/react-table";
import { PartiyaItem } from "./type";

// Using `any` for column data type to maintain compatibility with both
// the new InventoryItem (inventory report) and legacy SalesData (dashboard)
const SharedColumns: ColumnDef<any>[] = [
  {
    header: "Soni",
    accessorKey: "count",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.count || row.original.totalCount || 0} шт</p>
    ),
  },
  {
    header: "Hajm",
    accessorKey: "kv",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.kv || row.original.totalKv || 0).toFixed(2)} м²
      </p>
    ),
  },
  {
    header: "Summa",
    accessorKey: "sum",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.sum || row.original.totalPrice || row.original.totalKvPrice || 0).toFixed(2)} $
      </p>
    ),
  },
  {
    header: "Foyda",
    accessorKey: "profit",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500] text-green-600">
        {(row.original.profit || 0).toFixed(2)} $
      </p>
    ),
  },
];

export const CountryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Davlat",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title || row.original?.country?.title}</p>
    ),
  },
  ...SharedColumns,
];

export const FactoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Zavod",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title || row.original?.factory?.title}</p>
    ),
  },
  ...SharedColumns,
];

export const CollectionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Kolleksiya",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title || row.original?.collection?.title}</p>
    ),
  },
  ...SharedColumns,
];

export const ModelColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Model",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const SizeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "O'lcham",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const PartiyaColumns: ColumnDef<PartiyaItem>[] = [
  {
    accessorKey: "partiyaNo",
    header: "Partiya",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.partiyaNo}</p>
    ),
  },
  {
    accessorKey: "country",
    header: "Davlat",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.country}</p>
    ),
  },
  {
    accessorKey: "factory",
    header: "Zavod",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.factory}</p>
    ),
  },
  {
    accessorKey: "date",
    header: "Sana",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.date}</p>
    ),
  },
  {
    header: "Qoldiq (шт)",
    accessorKey: "remainingCount",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.remainingCount}</p>
    ),
  },
  {
    header: "Qoldiq (м²)",
    accessorKey: "remainingKv",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.remainingKv || 0).toFixed(2)}
      </p>
    ),
  },
  {
    header: "Qoldiq ($)",
    accessorKey: "remainingSum",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.remainingSum || 0).toFixed(2)}
      </p>
    ),
  },
  {
    header: "Sotilgan (м²)",
    accessorKey: "soldKv",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.soldKv || 0).toFixed(2)}
      </p>
    ),
  },
  {
    header: "Foyda",
    accessorKey: "profit",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500] text-green-600">
        {(row.original.profit || 0).toFixed(2)} $
      </p>
    ),
  },
];
