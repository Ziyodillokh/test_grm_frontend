import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TData } from "../type";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UpdatePatchData } from "@/service/apiHelpers";
import { toast } from "sonner";

export const Columns: ColumnDef<TData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row?.index + 1}</p>;
    },
  },
  {
    header: "Название",
    accessorKey: "name",
    id: "name",
  },
  {
    header: "Адресс",
    accessorKey: "address",
    id: "address",
  },

  {
    header: "Телефон",
    accessorKey: "phone1",
    id: "phone1",
  },
  {
    header: "Статус",
    cell: ({ row }) => {
      return <p>{row?.original?.isActive ? "Активный" : "Не активен"}</p>;
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
          url={apiRoutes.filial}
          // ShowPreview={row.original?.need_get_report}
          id={row.original?.id}
        >
          {row.original?.need_get_report ? (
            <>
              <DropdownMenuItem>Переучёт отправлен</DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                UpdatePatchData(
                  apiRoutes.filialMakeReport,
                  row.original?.id,
                  {}
                )
                  .then(() => toast.success("Переучёт отправлен"))
                  .catch(() => toast.error("что-то пошло не так"));
              }}
            >
              Запросить переучёт
            </DropdownMenuItem>
          )}
        </TableAction>
      );
    },
  },
];
