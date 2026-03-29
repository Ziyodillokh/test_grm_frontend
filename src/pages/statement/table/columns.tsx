import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Statement } from "../type";
import { ActionCell } from "./ActionCell";
import { useStatusMutation } from "../form/action";
import ActionBadge from "@/components/actionBadge";
import ActionButton from "@/components/actionButton";

// Status badge renderer

export const StatementColumns: ColumnDef<Statement>[] = [
  {
    header: "Название",
    accessorKey: "title",
  },
  {
    header: "Дата создание",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <span className="text-foreground">
          {format(new Date(row.original.createdAt), "dd.MM.yyyy")}
        </span>
      );
    },
  },
  {
    header: "Премии",
    accessorKey: "premiumsTotal",
    cell: ({ row }) => {
      return <span className="text-[#58A0C6]">{row.original.premium} $</span>;
    },
  },
  {
    header: "Бонусы",
    accessorKey: "bonusesTotal",
    cell: ({ row }) => {
      return (
        <span className="text-[#C3AD54]">{row.original.payroll?.bonus} $</span>
      );
    },
  },
  {
    header: "Зарплата",
    accessorKey: "salaryTotal",
    cell: ({ row }) => {
      return <span className="text-[#E38157]">{row.original.total} $</span>;
    },
  },
  {
    header: "Итого сумма",
    accessorKey: "totalSum",
    cell: ({ row }) => {
      return (
        <span className="text-[#5D5D53]">
          {row.original?.total?.toLocaleString()} $
        </span>
      );
    },
  },
  {
    header: "Статус",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = {
        Rejected: "rejected",
        InProgress: "inProgress",
        Accepted: "accepted",
      };
      const { mutate, isPending } = useStatusMutation();
      return (
        row.original.status == "Sent" ? (
          <ActionButton
            onClick={(e) => {
              if (row?.original?.status == "Sent") {
                mutate({
                  id: String(row.original.id),
                  status: "InProgress",
                });
              }
              e.stopPropagation();
            }}
            isLoading={isPending}
            status="accept"
            btnText="Отправить"
          />
        ) : (
          <ActionBadge
            status={status?.[row.original.status as keyof typeof status]}
          />
        )
      );
    },
  },
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => (
      <ActionCell row={row} onDeleteClick={() => {}} onEditClick={() => {}} />
    ),
  },
];
