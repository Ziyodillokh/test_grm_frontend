import { ColumnDef } from "@tanstack/react-table";

const SharedColumns: ColumnDef<any>[] = [
  {
    header: "Soni",
    accessorKey: "count",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.count || 0} шт</p>
    ),
  },
  {
    header: "Hajm",
    accessorKey: "kv",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.kv || 0).toFixed(2)} м²
      </p>
    ),
  },
  {
    header: "Summa",
    accessorKey: "sum",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.sum || 0).toFixed(2)} $
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
  {
    header: "Chegirma",
    accessorKey: "discount",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500] text-orange-500">
        {(row.original.discount || 0).toFixed(2)} $
      </p>
    ),
  },
];

export const FilialColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Filial",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const DealerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Diller",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const InternetColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Internet filial",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const CountryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Davlat",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const FactoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Zavod",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
    ),
  },
  ...SharedColumns,
];

export const CollectionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Kolleksiya",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.title}</p>
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

export const PartiyaColumns: ColumnDef<any>[] = [
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
    header: "Sotilgan (шт)",
    accessorKey: "soldCount",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">{row.original.soldCount}</p>
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
    header: "Summa ($)",
    accessorKey: "soldSum",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500]">
        {(row.original.soldSum || 0).toFixed(2)}
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
  {
    header: "Chegirma",
    accessorKey: "discount",
    cell: ({ row }) => (
      <p className="text-[14px] font-[500] text-orange-500">
        {(row.original.discount || 0).toFixed(2)} $
      </p>
    ),
  },
];
