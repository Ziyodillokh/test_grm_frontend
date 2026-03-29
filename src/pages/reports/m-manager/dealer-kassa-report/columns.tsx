import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { TKassareportData } from "./type";
import ActionBadge from "@/components/actionBadge";
import TebleAvatar from "@/components/teble-avatar";


export const KassaColumnsLoc: ColumnDef<TKassareportData>[] = [
  {
    id: "Филиал",
    header: "Дата",
    cell: ({ row }) => {
      return (
        <p >
          {row?.original?.filial?.title}
        </p>
      );
    },
  },
  {
    header: "Наличие",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#89A143] text-nowrap ">
          {
            (item?.in_hand).toFixed(2) + " $"}
        </p>
      );
    },
  },

  {
    header: "Терминал",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#58A0C6]"> {item?.totalPlasticSum.toFixed(2)} $</p>;
    },
  },
  {
    header: "Задолжность",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[#FF6600]"> {item?.totalExpense} $</p>;
    },
  },

  {
    header: "D-менеджер",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex gap-2 items-center">
          <TebleAvatar status={item?.status == "open" ? "panding" : item?.status == "rejected" ? "fail" : "success"} name={"D"} />
        </div>
      )
    },
  },
  {
    header: "Статус",
    id: "status",
    cell: ({ row }) => {
      const item = row.original;


      return (
        <div onClick={(e) => e.stopPropagation()}>
          {item?.kassaReportStatus == 2 ? (
            <ActionBadge status={"willSell"} />
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
