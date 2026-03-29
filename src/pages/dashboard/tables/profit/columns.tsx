import { SalesData } from "@/pages/reports/m-manager/remaider/type";
import { ColumnDef } from "@tanstack/react-table";


export const AllColumns: ColumnDef<SalesData>[] = [
  {
    header: "Объём",
    accessorKey: "totalKv",
    cell: ({ row }) => {
      return (
        <p className="text-[14px]  py-4 font-[500]">
          {Number(row.original?.totalKv)?.toFixed(2) || 0} м²
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
         { Number(row.original?.totalPrice || row.original?.totalKvPrice ||0)?.toFixed(2) } $
        </p>
      );
    },
  },
  {
    accessorKey: "totalCount",
    cell: ({ row }) => {
      return <p className="text-[14px]  font-[500]">{row.original?.totalNetProfitPrice || 0} $</p>;
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


