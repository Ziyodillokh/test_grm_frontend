import { ColumnDef } from "@tanstack/react-table";
import { TKassareportData } from "./type";
import ActionBadge from "@/components/actionBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData, PatchData } from "@/service/apiHelpers";
import { IUserData, TResponse } from "@/types";
import TebleAvatar from "@/components/teble-avatar";
import { useMeStore } from "@/store/me-store";
import { toast } from "sonner";
import ActionButton from "@/components/actionButton";
import { MonthsArray } from "@/consts";

export const KassaColumnsLoc: ColumnDef<TKassareportData>[] = [
  {
    id: "startDate",
    header: "Дата",
    cell: ({ row }) => {
      const item = row.original;
      const isTrue = item?.kassaReportStatus == 2;
      return (
        <p className={`${isTrue ? "text-[#89A143]" : ""}`}>
          {isTrue
            ? MonthsArray[item?.month - 1].label + "-Продалажется"
            : MonthsArray[item?.month - 1].label || ""}
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
          {item?.managerSum?.toFixed(2)} $
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
          {(item?.totalPlasticSum).toFixed(2)} $
        </p>
      );
    },
  },
  {
    header: "Скидка",
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className={item?.totalDiscount != 0 ? "text-[#E38157]" : ""}>
          {" "}
          {item?.totalDiscount} $
        </p>
      );
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
      return <p className="text-[#E38157]"> {item?.totalExpense} $</p>;
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
                    (item?.position.role == 10
                      ? "m_manager_confirmed"
                      : "accountant_confirmed") ||
                    row?.original?.status == "accepted"
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
          PatchData(apiRoutes.reports + "/" + row?.original?.id + '/close', {}),
        onSuccess: () => {
          toast.success("Closed");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
        },
      });

      return (
        <div onClick={(e) => e.stopPropagation()}>
          {item?.reportStatus == 2 ? (
            <ActionBadge status={"willSell"} />
          ) : item?.status == "open" && ((meUser?.position?.role == 10 && !item?.isAccountantConfirmed) || (meUser?.position?.role == 9 && !item?.isMManagerConfirmed)) ? (
            <ActionButton
              btnText="Закрыть"
              onClick={() => mutate()}
              isLoading={isPending}
              status="accept"
            ></ActionButton>
          ) : (
            <ActionBadge status={item?.status == "accepted" ? "closed" : "inProgress"} />
          )}
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: "actions",
  //   cell: () => (
  //     <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon">
  //       <MoreHorizontal className="h-4 w-4" />
  //     </Button>
  //   ),
  // },
];
