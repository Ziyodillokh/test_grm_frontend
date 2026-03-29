// table/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { TData } from "../type";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";


export const BonusColumns: ColumnDef<TData>[] = [
  {
    header: "Название",
    accessorKey: "title",
  },
  {
    header: "Условия",
    accessorKey: "condition",
  },
  {
    header: "Ед.измерения",
    accessorKey: "conditionUnit",
   
  },
  {
    header: "Оператор",
    accessorKey: "operator",
  },
  {
    header: "Бонус",
    accessorKey: "bonusAmount",
  
  },
  {
    header: "Ед.измерения",
    accessorKey: "bonusUnit",
  },

  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.bonus}
          refetchUrl={apiRoutes.bonus}
          ShowPreview={false}
          id={row.original?.id}
        />
      );
    },
  },
];

