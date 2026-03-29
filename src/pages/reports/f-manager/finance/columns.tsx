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

export const KassaColumnsLoc: ColumnDef<TKassareportData>[] = [
  {
    id: "startDate",
    header: "Дата",
    cell: ({ row }) => {
      const month = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      const item = row.original;
      const isTrue = item?.kassaReportStatus == 2;
      return (
        <p className={`${isTrue ? "text-[#89A143]" : ""}`}>
          {isTrue
            ? month[item?.month - 1] + "-Продалажется"
            : month[item?.month - 1] || ""}
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
        <p className={`${(item?.in_hand >= 0) ? "text-[#89A143]" : "text-red-500"} text-nowrap  `}>
          {item?.in_hand}
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
      return <p> {item?.totalPlasticSum} $</p>;
    },
  },
  {
    header: "В долг",
    id: "debt_sum",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.debt_sum} $</p>;
    },
  },
  {
    header: "Скидка",
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalDiscount} $</p>;
    },
  },

  {
    header: "Навар",
    id: "additionalProfitTotalSum",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.additionalProfitTotalSum} $</p>;
    },
  },

  {
    header: "Объём",
    id: "totalSize",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalSize} м²</p>;
    },
  },
  {
    header: "Приход",
    id: "income",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalIncome} $</p>;
    },
  },
  {
    header: "Расход",
    id: "expense",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalExpense} $</p>;
    },
  },
  {
    header: "Инкассация",
    id: "cash_collection",
    cell: ({ row }) => {
      const item = row.original;
      return <p> {item?.totalCashCollection} $</p>;
    },
  },
  // {
  //   header: "Кассир",
  //   id: "closer",
  //   cell: ({ row }) => {
  //     const item = row.original;
  //     return item?.status != "open" ? (
  //       <div className="flex items-center">
  //         {
  //           <img
  //             className="w-[40px] rounded-full border-background border h-[40px]"
  //             src={minio_img_url + item?.closer?.avatar?.path}
  //           />
  //         }
  //         {item?.status != "closed_by_c" ? (
  //           <img
  //             className="w-[40px]  border-background border-[2px]  -translate-x-2 rounded-full h-[40px]"
  //             src={minio_img_url + item?.closer_m?.avatar?.path}
  //           />
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     ) : (
  //       ""
  //     );
  //   },
  // },
  {
    header: "Статус",
    id: "status",
    cell: ({ row }) => {
      const item = row.original;
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          PatchData(apiRoutes.kassaReports + "/" + row?.original?.id, {}),
        onSuccess: () => {
          toast.success("Closed");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
        },
      });
      return (
        <div onClick={(e) => e.stopPropagation()}>
          {(item?.kassaReportStatus == 2) ? (
            <ActionBadge status={"willSell"} />
          ) : item?.status == "open" ? (
            <ActionButton onClick={() => mutate()} isLoading={isPending} btnText={"Закрыт"} status="accept"></ActionButton>
          ) : (
            <ActionBadge status={(item?.status == "m_manager_confirmed" || item?.status == "accountant_confirmed") ? "pending" : item?.status} />
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
