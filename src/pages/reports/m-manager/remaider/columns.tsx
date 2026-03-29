import { ColumnDef } from "@tanstack/react-table";
import { SalesData } from "./type";

export const AllColumns: ColumnDef<SalesData>[] = [


  {
    header: "Объём",
    accessorKey: "totalKv",
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-[500]">
          {row.original?.totalKv?.toFixed(2) || 0} м²
        </p>
      );
    },
  },
  {
    header: " Сумма",
    accessorKey: "totalKvPrice",
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-[500]">
         { (row.original?.totalPrice || row.original?.totalKvPrice)?.toFixed(2) || 0} $
        </p>
      );
    },
  },
  {
    header: "Кол-во ковров",
    accessorKey: "totalCount",
    cell: ({ row }) => {
      return <p className="text-[14px] p-4 font-[500]">{row.original?.totalCount || 0} шт</p>;
    },
  },
 
];

export const CountryColumns: ColumnDef<SalesData>[] = [

  {
    accessorKey: "title",
    header: "Страна",
   
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original?.country?.title}
          </p>
        </div>
      );
    },
  },
  ...AllColumns,
];


export const FactoryColumns: ColumnDef<SalesData>[] = [

  {
    accessorKey: "title",
    header: "Поставщикам",
   
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original?.factory?.title}
          </p>
        </div>
      );
    },
  },
  ...AllColumns,
];


export const CollectionColumns: ColumnDef<SalesData>[] = [

  {
    accessorKey: "title",
    header: "Коллекциям",
   
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original?.collection?.title}
          </p>
        </div>
      );
    },
  },
  ...AllColumns,
];

export const ModelColumns: ColumnDef<SalesData>[] = [

  {
    accessorKey: "title",
    header: "Модели",
   
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original?.title}
          </p>
        </div>
      );
    },
  },
  ...AllColumns,
];
export const SizeColumns: ColumnDef<SalesData>[] = [

  {
    accessorKey: "title",
    header: "Размеры",
   
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original?.title}
          </p>
        </div>
      );
    },
  },
  ...AllColumns,
];


