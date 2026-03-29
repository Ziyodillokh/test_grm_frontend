// table/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { TData } from "../type";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { format } from "date-fns";


export const AwardsColumns: ColumnDef<TData>[] = [
  {
    header: "Название",
    accessorKey: "title",
  },
  {
    header: "Дата создания премии",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <span className="text-foreground">
          {format(new Date(row.original?.createdAt), "dd.MM.yyyy")}
        </span>
      );
    },
  },
  {
    header: "Сумма",
    accessorKey: "sum",
    cell: ({ row }) => {
      return (
        <p>{row?.original?.sum} $</p>
      );
    },
  },
 
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.awards}
          refetchUrl={apiRoutes.awards}
          ShowPreview={false}
          id={row.original?.id}
        />
      );
    },
  },
];

