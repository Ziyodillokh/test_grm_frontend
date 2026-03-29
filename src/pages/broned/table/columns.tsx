import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { BronedData } from "../type";

export const BronedColumns: ColumnDef<BronedData>[] = [
  {
    accessorKey: "id",
    header: "#N",
    size: 50,
  },
  {
    id: "code",
    header: "code",
    accessorKey: "code",
  },
  {
    header: "collection",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.collection?.title}</p>;
    },
  },
  {
    header: "model",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.model?.title}</p>;
    },
  },
  {
    header: "size",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.size?.title}</p>;
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      return <p>{row.original?.x}шт</p>;
    },
  },
  {
    header: "shape",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.shape?.title}</p>;
    },
  },
  {
    header: "style",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.style?.title}</p>;
    },
  },
  {
    header: "color",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.color?.title}</p>;
    },
  },
  {
    header: "price",
    cell: ({ row }) => {
      return <p>{row.original.product?.price} $</p>;
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
          url={apiRoutes.broned}
          ShowUpdate={false}
          ShowDelete={false}
          ShowPreview
          id={row.original?.id}
        />
      );
    },
  },
];
