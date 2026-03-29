import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { TKassareportData } from "./type";
import TableAction from "@/components/table-action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData, PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { toast } from "sonner";
import TebleAvatar from "@/components/teble-avatar";
import ActionBadge from "@/components/actionBadge";
import ActionButton from "@/components/actionButton";
import { useMeStore } from "@/store/me-store";
import { IUserData, TResponse } from "@/types";

export const KassaColumnsLoc: ColumnDef<TKassareportData>[] = [
  {
    id: "startDate",
    header: "Филиалы",
    cell: ({ row }) => {
      const isMy = row?.original?.status == "my";
      return (
        <p className={isMy ? "text-[#89A143] py-2" : ""}>
          {isMy
            ? "Бизнес приходы и расходы"
            : row?.original?.isDealer
              ? "Dealer-manager"
              : row?.original?.payrollsDealerId ? "Ведомость" : row?.original?.filial?.title}
        </p>
      );
    },
  },
  {
    header: "Наличие",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      const isMy = row?.original?.status == "my";
      return (
        <p className={`text-nowrap  ${((item?.in_hand || 0) >= 0) ? "text-[#89A143]" : "text-red-500"} `}>
          {isMy
            ? ""
            : (item?.in_hand || 0).toFixed(2)}
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
        <p className="text-[#58A0C6]">
          {" "}
          {item?.totalPlasticSum?.toFixed(2)} {item?.totalPlasticSum ? "$" : ""}
        </p>
      );
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
      return (
        <p className={item?.totalDiscount != 0 ? "text-[#E38157]" : ""}>
          {item?.totalDiscount?.toFixed(2)} {item?.totalDiscount ? "$" : ""}
        </p>
      );
    },
  },

  {
    header: "Навар",
    id: "additionalProfitTotalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {" "}
          {item?.additionalProfitTotalSum?.toFixed(2)}{" "}
          {item?.additionalProfitTotalSum ? "$" : ""}
        </p>
      );
    },
  },

  {
    header: "Объём",
    id: "totalSize",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {" "}
          {item?.totalSize} {item?.totalSize ? "м²" : ""}{" "}
        </p>
      );
    },
  },
  {
    header: "Приход",
    id: "income",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {item?.totalIncome} {item?.totalIncome ? "$" : ""}
        </p>
      );
    },
  },
  {
    header: "Расход",
    id: "expense",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[#E38157]">
          {item?.totalExpense} {item?.totalExpense?.toFixed(2) ? "$" : ""}
        </p>
      );
    },
  },
  {
    header: "Инкассация",
    id: "cash_collection",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p>
          {item?.totalCashCollection?.toFixed(2)}
          {item?.totalCashCollection ? "$" : ""}
        </p>
      );
    },
  },
  {
    header: "Принял",
    id: "closer",
    cell: ({ row }) => {
      const { data } = useQuery({
        queryKey: [apiRoutes.reports],
        queryFn: () =>
          getAllData<TResponse<IUserData>, object>(
            apiRoutes.userManagersAccountants,
            {}
          ),
      });
      return (
        <div className="flex gap-2 items-center">
          {row?.original?.status != "my" && data?.items?.length
            ? data?.items?.map((item) => (
              <TebleAvatar
                key={item?.id}
                status={
                  row?.original?.status ==
                    (item?.position.role == 9
                      ? "m_manager_confirmed"
                      : "accountant_confirmed") ||
                    row?.original?.status == "accepted" || (item?.position.role == 9 && row?.original?.isMManagerConfirmed) || (item?.position.role == 10 && row?.original?.isAccountantConfirmed)
                    ? "success"
                    : row?.original?.status == "rejected"
                      ? "fail"
                      : "panding"
                }
                url={item?.avatar?.path}
                name={item?.firstName}
              />
            ))
            : ""}
        </div>
      );
    },
  },
  {
    header: "Статус",
    id: "status",
    cell: ({ row }) => {
      const { meUser } = useMeStore();
      const item = row.original;
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          PatchData(
            (item?.dealerReportId)
              ? `${apiRoutes.reports}/${item?.dealerReportId}/close-dealer`
              : item?.payrollsDealerId ? apiRoutes.payrolls + `/${item?.payrollsDealerId}/close-payroll` :
                apiRoutes.kassaReports + "/" + row?.original?.id,
            {}
          ),
        onSuccess: () => {
          toast.success("Closed");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.payrollsDealer] });
          queryClient.invalidateQueries({
            queryKey: [apiRoutes.reportsDealer],
          });
        },
      });

      return (
        <div onClick={(e) => e.stopPropagation()}>

          {item?.status == "my" ? (
            ""
          )
            : item?.status == "accepted" || (item?.status == "Accepted" && item?.payrollsDealerId) ? <ActionBadge status={"accepted"} /> :
              item?.status == "closed" || (item?.status == "InProgress" && item?.payrollsDealerId) ||
                (item?.status == "closed_by_d") || //  && !item?.isDealer
                (meUser?.position?.role == 10 &&
                  (item?.status == "m_manager_confirmed" || item?.isMManagerConfirmed)) ||
                (meUser?.position?.role == 9 &&
                  (item?.status == "accountant_confirmed" || item?.isAccountantConfirmed)) ? (
                <ActionButton
                  onClick={() => mutate()}
                  isLoading={isPending}
                  status="accept"
                ></ActionButton>
              ) : (
                <ActionBadge
                  status={
                    item?.status == "open" || item?.kassaReportStatus == 2 || (item?.status == "Sent" && item?.payrollsDealerId)
                      ? "inProgress"
                      : item?.status == "accountant_confirmed" ||
                        item?.status == "m_manager_confirmed" || item?.isAccountantConfirmed || item?.isMManagerConfirmed
                        ? "pending"
                        : item?.status
                  }
                />
              )}
        </div>
      );
    },
  },
  // /payrolls/{id}/reject
  {
    id: "actions",
    header: "actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: async () => {
          return await UpdatePatchData(
            row?.original?.payrollsDealerId ? apiRoutes.payrolls + `/${row?.original?.payrollsDealerId}/reject` :
              apiRoutes.kassaReports + "/reject",
            row?.original?.id ? row?.original?.id : '',
            {}
          );
        },
        onSuccess: () => {
          toast.success("Status changed successfully");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.payrollsDealer] });
        },
      });
      return row?.original?.status != "my" ? (
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="ghost"
          size="icon"
        >
          <TableAction
            ShowDelete={false}
            ShowPreview={false}
            ShowUpdate={false}
          >
            <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
              {isPending ? <Loader /> : ""} Отменить
            </DropdownMenuItem>
          </TableAction>
        </Button>
      ) : (
        ""
      );
    },
  },
];
