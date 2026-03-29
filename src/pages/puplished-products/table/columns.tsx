import { ColumnDef } from "@tanstack/react-table";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { qrBaseIMarkerData, CollectionData } from "../type";
import { minio_img_url } from "@/constants";

export const CollectionColumns: ColumnDef<CollectionData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      return <p className="text-[14px] font-[500]">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "title",
    header: "Collection",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-[500]">
            {row.original.title}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "gap",
    size: 50,
    cell: () => {
      return <p className="w-[500px]"></p>;
    },
  },
  {
    header: "Объём",
    accessorKey: "totalKv",
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-[500]">
          {row.original.totalKv} м²
        </p>
      );
    },
  },
  {
    header: "Кол-во ковров",
    accessorKey: "totalCount",
    cell: ({ row }) => {
      return <p className="text-[14px] font-[500]">{row.original.totalCount} шт</p>;
    },
  },
  {
    header: "Кас-цена",
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original?.i_price;
      return (
        <p className="text-[14px] font-[500] text-[#E38157]">
          {price ? `${price}$` : '-'}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.products}
          ShowUpdate={false}
          ShowDelete={false}
          ShowPreview
          id={row.original.id}
        />
      );
    },
  },
];

export const ProductColumns: ColumnDef<qrBaseIMarkerData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    header: "rasm",
    id: "imgUrl",
    accessorKey: "imgUrl",
    cell: ({ row }) => {
      return (
        <img className="w-7 h-10 object-cover" src={minio_img_url + row.original?.imgUrl?.path} alt="" />
      );
    },
  },
  {
    header: "Баркод",
    id: "code",
    accessorKey: "code",
  },
  {
    header: "collection",
    id: "collection.title",
    accessorKey: "collection.title",
  },
  {
    header: "model",
    id: "model.title",
    accessorKey: "model.title",
  },
  {
    header: "size",
    cell: ({ row }) => {
      return (
        <p>{`${(row.original?.size?.x || 0) * 100}X${((row.original?.size?.y || 0) * 100)}`}</p>
      );
    },
  },
  {
    header: "Обьём",
    cell: ({ row }) => {
      const volume = (row.original?.size?.x || 0) * (row.original?.size?.y || 0);
      const count = 1;
      const totalVolume = volume * count;

      return (
        <p className="text-[14px] font-[500]">
          {`${totalVolume.toFixed(2)}`} м²
        </p>
      );
    },
  },
  {
    header: "shape",
    id: "shape.title",
    accessorKey: "shape.title",
  },
  {
    header: "style",
    id: "style.title",
    accessorKey: "style.title",
  },
  {
    header: "color",
    id: "color.title",
    accessorKey: "color.title",
  },
  {
    header: "country",
    id: "country.title",
    accessorKey: "country.title",
  },
  {
    header: "factory",
    id: "factory.title",
    accessorKey: "factory.title",
  },
  {
    header: "Партия",
    id: "partiya_no.title",
    accessorKey: "partiya_no.title",
  },

  {
    header: "Кас-цена",
    accessorKey: "price",
    cell: ({ row }) => {

      return (
        <p className="text-[14px] font-[500] text-[#E38157]">
          {`${row?.original?.i_price}$`}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.products}
          // ShowUpdate={false}
          ShowDelete={false}
          id={row.original?.id?.toString()}
        />
      );
    },
  },
];


