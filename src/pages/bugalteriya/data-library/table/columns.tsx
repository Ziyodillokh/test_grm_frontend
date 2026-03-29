import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";

import { TData } from "../type";
import { apiRoutes } from "@/service/apiRoutes";
import BarcodeGenerator from "@/components/react-barcode";


export const Columns: ColumnDef<TData>[] = [
 
  {
    header: "code",
    accessorKey: "code",
    cell: ({ row }) => {
      return  <BarcodeGenerator className="w-20 h-10" value={row.original?.code||""}/>;
    },
  },

  {
    header: "country",
    cell: ({ row }) => {
      return <p>{row.original?.country?.title}</p>;
    },
  },
  {
    header: "collection",
    cell: ({ row }) => {
      return <p>{row.original?.collection?.title}</p>;
    },
  },
  {
    header: "model",
    cell: ({ row }) => {
      return <p>{row.original?.model?.title}</p>;
    },
  },
  {
    header: "type-corpet",
    cell: ({ row }) => {
      return <p>{ row.original?.isMetric ? "Метражный" : "Штучный" }</p>;
    },
  },
  {
    header: "shape",
    cell: ({ row }) => {
      return <p>{row.original?.shape?.title}</p>;
    },
  },
  {
    header: "size",
    cell: ({ row }) => {
      return <p>{row.original?.size?.title}</p>;
    },
  },
  {
    header: "style",
    cell: ({ row }) => {
      return <p>{row.original.style?.title}</p>;
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
          url={apiRoutes.qrBase}
          id={row.original?.id}
        />
      );
    },
  },
];
