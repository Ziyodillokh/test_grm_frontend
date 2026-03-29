import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";

export const Columns: ColumnDef<TData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row?.index + 1}</p>;
    },
  },
  {
    header: "Коллекция",
    accessorKey: "name",
    id: "name",
    cell: () => {
      return "Anatoliya";
    },
  },
  {
    header: "Объём",
    accessorKey: "address",
    id: "address",

    cell: ({ row }) => {
      return (
        <p className="text-[#89A143]">
          {row?.original?.isActive ? "540 м²" : "65 $"}
        </p>
      );
    },
  },
  {
    header: "Сумма",
    accessorKey: "phone1",
    id: "phone1",
    cell: () => {
      return "12 340.00 $";
    },
  },
  {
    header: "Количество",
    cell: () => {
      return "348 шт";
    },
  },
  {
    header: "Объём продажы",
    cell: () => {
      return "540 м²";
    },
  },
  {
    header: "Сумма продажы",
    cell: () => {
      return "12 340.00 $";
    },
  },
  {
    header: "Количество",
    cell: () => {
      return "348 шт";
    },
  },
  {
    header: "Цена за м²",
    cell: ({ row }) => {
      return (
        <p className="text-[#E38157]">
          {row?.original?.isActive ? "65 $" : "65 $"}
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
      return <TableAction url={apiRoutes.filial} id={row.original?.id} />;
    },
  },
];
