import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";
import { MessageSquareText } from "lucide-react";

export const ClientsColumns: ColumnDef<TData>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "№",
    cell: ({ row }) => {
      return <>{row.index + 1}</>;
    },
  },
  {
    header: "Фамилия имя",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.fullName} 
        </p>
      );
    },
  },

  {
    header: "Флиал",
    cell: ({ row }) => {
      return <p>{row.original?.filial?.title}</p>;
    },
  },

  {
    header: "Телефон",
    accessorKey: "phone",
    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original?.phone}</p>;
    },
  },
  {
    header: "Задолжность",
    accessorKey: "owed",
      cell: ({ row }) => {
        return <p className="text-[#FF6600]">{row.original?.owed}</p>;
    },
  },

  {
    header: "Дано",
    accessorKey: "given",
      cell: ({ row }) => {
        return <p className="text-[#89A143]">{row.original?.given}</p>;
    },
  },
  {
    header: "Комментария",
    accessorKey: "commit",
      cell: ({ row }) => {
      return <p className=" flex items-start text-[#5D5D53] gap-1">  {row?.original?.comment && <MessageSquareText width={14} />} { row?.original?.comment}</p>;
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
          <TableAction url={apiRoutes.clients} id={row.original?.id} />
      );
    },
  },
];
