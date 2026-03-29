import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";

export const ClientsColumns: ColumnDef<TData>[] = [
  
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
    header: "Телефон",
    accessorKey: "phone",
    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original?.phone}</p>;
    },
  },

  {
    header: "Задолжность",
    accessorKey: "totalDebt",
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
    header: "Остаток долга",
    cell: ({row}) => {
      return <p className="text-[#FF6600]">{(row?.original?.owed - row?.original?.given).toFixed(2)} $</p>;
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
          <TableAction url={apiRoutes.debt} id={row.original?.id} />
      );
    },
  },
];
