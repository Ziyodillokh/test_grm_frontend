import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { TKassareportData } from "./type";
import ActionBadge from "@/components/actionBadge";
import ActionButton from "@/components/actionButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { PatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import TebleAvatar from "@/components/teble-avatar";
import { useMeStore } from "@/store/me-store";

export const KassaColumnsLoc: ColumnDef<TKassareportData>[] = [
  {
    id: "Филиал",
    header: "Дата",
    cell: ({ row }) => {
      return <p>{row?.original?.filial?.title}</p>;
    },
  },
  {
    header: "Наличие",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#89A143] text-nowrap ">
          {item?.in_hand?.toFixed(2)}
          $
        </p>
      );
    },
  },

  {
    header: "Терминал",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#58A0C6]"> {item?.totalPlasticSum.toFixed(2)} $</p>
      );
    },
  },
  {
    header: "Отправлено",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#58A0C6]"> {item?.debt_sum?.toFixed(2)} $</p>
      );
    },
  },
  {
    header: "Задолжность",
    id: "owed",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#FF6600]"> {item?.kassaReportStatus == 2 ? item?.filial?.owed : item?.dealer_frozen_owed} $</p>;
    },
  },

  {
    header: "D-менеджер",
    cell: ({ row }) => {
      const item = row.original;
      const { meUser } = useMeStore();
      return (
        <div className="flex gap-2 items-center">
          <TebleAvatar
            status={
              item?.status == "open"
                ? "panding"
                : item?.status == "rejected"
                  ? "fail"
                  : "success"
            }
            url={meUser?.avatar?.path}
            name={meUser?.firstName || "A"}
          />
        </div>
      );
    },
  },
  {
    header: "Статус",
    id: "status",
    cell: ({ row }) => {
      const item = row.original;
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          PatchData(
            apiRoutes.kassaReports +
            "/" +
            row?.original?.id +
            "/close-dmanager",
            {}
          ),
        onSuccess: () => {
          toast.success("Accepted");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
        },
      });

      return (
        <div onClick={(e) => e.stopPropagation()}>
          {item?.kassaReportStatus == 2 ? (
            <ActionBadge status={"willSell"} />
          ) : item?.status == "open" ? (
            <ActionButton
              onClick={() => mutate()}
              isLoading={isPending}
              status="accept"
            ></ActionButton>
          ) : (
            <ActionBadge status={item?.status} />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "actions",
    cell: () => (
      <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];
