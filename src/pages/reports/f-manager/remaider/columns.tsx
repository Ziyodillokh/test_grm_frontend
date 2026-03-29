import { ColumnDef } from "@tanstack/react-table";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
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
         { Number(row.original?.totalPrice || row.original?.totalKvPrice||0)?.toFixed(2) || 0} $
        </p>
      );
    },
  },
  {
    header: "Кол-во ковров",
    accessorKey: "totalCount",
    cell: ({ row }) => {
      return <p className="text-[14px] w-[200px] font-[500]">{row.original?.totalCount || 0} шт</p>;
    },
  },
 
  {
    id: "actions",  
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: () => {
      return (
        <TableAction
          url={apiRoutes.products}
          ShowUpdate={false}
          ShowDelete={false}
          ShowPreview={false}
          // id={row.original.id}
        />
      );
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


