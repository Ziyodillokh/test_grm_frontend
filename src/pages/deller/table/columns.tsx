import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";
import { useMeStore } from "@/store/me-store";

export const Columns: ColumnDef<TData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row?.index + 1}</p>;
    },
  },
  {
    header: "Название",
    accessorKey: "title",
    id: "title",
  },
  {
    header: "Адресс",
    accessorKey: "address",
    id: "address",
  },
  // {
  //   header: "Ответственное лицо",
  //   accessorKey: "address",
  //   id: "address",
  //   cell: ({ row }) => {
  //     return (
  //       <p>
  //         {row?.original?.firstName || "~"} {row?.original?.lastName}
  //       </p>
  //     );
  //   },
  // },

  {
    header: "Телефон",
    accessorKey: "phone1",
    id: "phone1",
  },
  // {
  //   header: "id для системы",
  //   accessorKey: "login",
  //   id: "login",
  // },
  {
    header: "Задолжность",
    cell: ({row}) => {
      return <p >{row?.original?.owed.toFixed(2) } $</p>;
    },
  },
  {
    header: "Дано",
    cell: ({row}) => {
      return <p className="text-[#89A143]">{row?.original?.given.toFixed(2)} $</p>;
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
      const {meUser} = useMeStore();
      if(meUser?.position?.role == 6 ){

        return <TableAction url={apiRoutes.filial} id={row.original?.id} />;
      }else{
        return <></>;
      }
    },
  },
];
