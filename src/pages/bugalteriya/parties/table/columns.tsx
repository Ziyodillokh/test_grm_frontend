import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";
import { useMeStore } from "@/store/me-store";

export const Columns: ColumnDef<TData>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "№",
    cell: ({ row }) => {
      return <>{row.index + 1}</>;
    },
  },
  {
    id: "factory",
    accessorKey: "factory.title",
    header: "Поставщик",
  },

  {
    accessorKey: "partiya_no.title",
    id: "partiya_no",
    header: "Партия",
  },
  {
    id: "country",
    accessorKey: "country.title",
    header: "Страна",
  },
  {
    accessorKey: "volume",
    id: "volume",
    header: "Обьём",
    cell: ({ row }) => {
      return <>{row.original.volume}м²</>;
    },
  },
 
  {
    id: "expense",
    accessorKey: "expense",
    header: "Расход",
    cell: ({ row }) => {
      return <>{row.original.expense}$</>;
    },
  },
  {
    id: "warehouse.name",
    accessorKey: "warehouse.name",
    header: "Склад",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Дата создание",
    cell: ({ row }) => {
      return format(row.original.date, "dd.MM.yyyy");
    },
  },
  {
    id: "partiya_status.title",
    accessorKey: "partiya_status.title",
    header: "Статус пратии",
    cell: ({ row }) => {
      const status =row.original.partiya_status
      return (
          <div> {status =="new"? "Открыто": status == "pending" || status == "closed" ? "В ожидании": "Закрыто"}</div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      const { meUser } = useMeStore();
      return (
        <TableAction
          url={apiRoutes.parties}
          ShowPreview
          ShowDelete={meUser?.position.role !== 7}
          id={row.original?.id}
        />
      );
    },
  },
];
