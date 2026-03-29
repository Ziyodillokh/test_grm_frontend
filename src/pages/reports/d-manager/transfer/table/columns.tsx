import { ColumnDef } from "@tanstack/react-table";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import { TransferData } from "../type";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ActionBadge from "@/components/actionBadge";
import ActionButton from "@/components/actionButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdatePatchData } from "@/service/apiHelpers";
import { format } from "date-fns";

export const collactionColumns: ColumnDef<TransferData>[] = [
  {
    accessorKey: "id",
    header: "№",
    size: 50,
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    header: "Название",
    cell: ({ row }) => {
      return (
        <p>
          TR-{" "}
          {format(
            row?.original?.status === "progress"
              ? new Date()
              : new Date(row.original?.dateTwo),
            "dd.MM.yyyy"
          )}
        </p>
      );
    },
  },
  {
    header: "Кол-во",
    cell: ({ row }) => {
      return <p>{row?.original?.total_count} шт</p>;
    },
  },
  {
    header: "Обём",
    cell: ({ row }) => {
      return <p>{row?.original?.total_kv} м²</p>;
    },
  },
  {
    header: "Cумма",
    cell: ({ row }) => {
      return <p>{row?.original?.total_sum} $</p>;
    },
  },
  {
    header: "Навар",
    cell: ({ row }) => (
      <p className="w-[60px] text-nowrap py-2">{row?.original?.total_profit_sum} $</p>
    ),
  },

  {
    header: "Статус",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          UpdatePatchData(
            apiRoutes.acceptPackage + "/accepted",
            row?.original?.id,
            {}
          ),
        onSuccess: () => {
          toast.success("отправлено");
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.packageTransfer],
          });
        },
      });
      return row?.original?.status == "progress" ? (
        <ActionButton
          isLoading={isPending}
          onClick={(e) => {
            e.stopPropagation()
            mutate()
          }}
          btnText="отправить"
          status="accept"
        />
      ) : (
        <ActionBadge status={row?.original?.status} />
      );
    },
  },

  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          UpdatePatchData(
            apiRoutes.acceptPackage + "/rejected",
            row?.original?.id,
            {}
          ),
        onSuccess: () => {
          toast.success("отменено");
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.packageTransfer],
          });
        },
      });
      return (
        <TableAction
          url={apiRoutes.transfers}
          ShowDelete={false}
          ShowUpdate={false}
          id={row.original?.id}
        >
          {row?.original?.status == "progress" && (
            <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
              Отменить
            </DropdownMenuItem>
          )}
        </TableAction>
      );
    },
  },
];
