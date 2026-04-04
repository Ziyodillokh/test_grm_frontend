import { ColumnDef } from "@tanstack/react-table";
import { TKassareportData } from "../../../report-finance/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
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

function getStatusBadge(item: TKassareportData) {
  if (item?.status === "accepted")
    return { label: "Tasdiqlangan", dot: "bg-green-500", cls: "text-green-700 border-green-300 bg-green-50" };
  if (item?.isManagerRejected || item?.isAccountantRejected)
    return { label: "Qaytarilgan", dot: "bg-red-500", cls: "text-red-700 border-red-300 bg-red-50" };
  if (item?.status === "closed" || item?.status === "closed_by_d")
    return { label: "Yopilgan", dot: "bg-blue-500", cls: "text-blue-700 border-blue-300 bg-blue-50" };
  if (item?.reportStatus === 2)
    return { label: "Jarayonda...", dot: "bg-green-400", cls: "text-green-700 border-green-300 bg-green-50" };
  return { label: "Kutilayotgan", dot: "bg-yellow-500", cls: "text-yellow-700 border-yellow-300 bg-yellow-50" };
}

export const DetailColumns: ColumnDef<TKassareportData>[] = [
  {
    id: "in_hand",
    header: "Saldo",
    cell: ({ row }) => {
      const val = row.original?.in_hand || 0;
      return (
        <p className={`font-semibold ${val >= 0 ? "text-[#89A143]" : "text-red-500"}`}>
          {val >= 0 ? "+" : ""}{val.toFixed(2)}
        </p>
      );
    },
  },
  {
    id: "status_avatar",
    header: "Status",
    cell: ({ row }) => {
      const { data } = useQuery({
        queryKey: [apiRoutes.userManagersAccountants],
        queryFn: () =>
          getAllData<TResponse<IUserData>, object>(
            apiRoutes.userManagersAccountants,
            {}
          ),
      });
      const item = row.original;
      return (
        <div className="flex gap-2 items-center">
          {data?.items?.map((user) => (
            <TebleAvatar
              key={user?.id}
              status={
                item?.status === "accepted" ||
                (user?.position?.role == 9 && item?.isMManagerConfirmed) ||
                (user?.position?.role == 10 && item?.isAccountantConfirmed)
                  ? "success"
                  : item?.isManagerRejected && user?.position?.role == 9
                    ? "fail"
                    : item?.isAccountantRejected && user?.position?.role == 10
                      ? "fail"
                      : "panding"
              }
              url={user?.avatar?.path}
              name={user?.firstName}
            />
          ))}
        </div>
      );
    },
  },
  {
    id: "holati",
    header: "Holati",
    cell: ({ row }) => {
      const badge = getStatusBadge(row.original);
      return (
        <Badge variant="outline" className={`rounded-full py-1 px-3 text-xs gap-1.5 ${badge.cls}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          {badge.label}
        </Badge>
      );
    },
  },
  {
    id: "filial",
    header: "Filial",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="font-medium">
          {item?.isDealer ? "Dillerlar" : item?.filial?.title || "—"}
        </p>
      );
    },
  },
  {
    id: "sale",
    header: "Savdo",
    cell: ({ row }) => {
      const val = row.original?.sale ?? row.original?.totalSale ?? 0;
      return <p>{val.toLocaleString()}$</p>;
    },
  },
  {
    id: "terminal",
    header: "Terminal",
    cell: ({ row }) => {
      const val = row.original?.plasticSum ?? row.original?.totalPlasticSum ?? 0;
      return <p className="text-[#58A0C6]">{val.toLocaleString()}$</p>;
    },
  },
  {
    id: "debt",
    header: "Qarz",
    cell: ({ row }) => {
      const val = row.original?.debt_sum ?? 0;
      return <p>{val.toLocaleString()}$</p>;
    },
  },
  {
    id: "inkassa",
    header: "Inkassa",
    cell: ({ row }) => {
      const val = row.original?.cash_collection ?? row.original?.totalCashCollection ?? 0;
      return <p>{val.toLocaleString()}$</p>;
    },
  },
  {
    id: "hajm",
    header: "Hajm",
    cell: ({ row }) => {
      const val = row.original?.totalSize ?? 0;
      return <p>{val.toFixed(0)} m²</p>;
    },
  },
  {
    id: "foyda",
    header: "Foyda",
    cell: ({ row }) => {
      const val = row.original?.additionalProfitTotalSum ?? 0;
      return <p className="text-[#89A143]">+{val.toFixed(2)}$</p>;
    },
  },
  {
    id: "chegirma",
    header: "Chegirma",
    cell: ({ row }) => {
      const val = row.original?.discount ?? row.original?.totalDiscount ?? 0;
      return <p className="text-red-500">-{Math.abs(val).toFixed(2)}$</p>;
    },
  },
  {
    id: "status_action",
    header: "",
    cell: ({ row }) => {
      const { meUser } = useMeStore();
      const item = row.original;
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: () =>
          PatchData(
            item?.isDealer && item?.dealerReportId
              ? `${apiRoutes.reports}/${item.dealerReportId}/close-dealer`
              : apiRoutes.kassaReports + "/" + item?.id,
            {}
          ),
        onSuccess: () => {
          toast.success("Tasdiqlandi");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reportsDealer] });
        },
      });

      if (item?.status === "accepted") {
        return <ActionBadge status="accepted" />;
      }

      if (
        item?.status === "closed" ||
        item?.status === "closed_by_d" ||
        (meUser?.position?.role == 10 && item?.isMManagerConfirmed) ||
        (meUser?.position?.role == 9 && item?.isAccountantConfirmed)
      ) {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionButton
              onClick={() => mutate()}
              isLoading={isPending}
              status="accept"
            />
          </div>
        );
      }

      return (
        <ActionBadge
          status={
            item?.status === "open" || item?.reportStatus === 2
              ? "inProgress"
              : item?.isAccountantConfirmed || item?.isMManagerConfirmed
                ? "pending"
                : (item?.status || "open")
          }
        />
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { mutate, isPending } = useMutation({
        mutationFn: async () => {
          return await UpdatePatchData(
            apiRoutes.kassaReports + "/reject",
            row?.original?.id ? row.original.id : "",
            {}
          );
        },
        onSuccess: () => {
          toast.success("Qaytarildi");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.kassaReports] });
        },
      });
      return (
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="ghost"
          size="icon"
        >
          <TableAction ShowDelete={false} ShowPreview={false} ShowUpdate={false}>
            <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
              {isPending ? <Loader className="animate-spin" /> : ""} Qaytarish
            </DropdownMenuItem>
          </TableAction>
        </Button>
      );
    },
  },
];
