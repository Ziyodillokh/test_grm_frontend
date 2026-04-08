import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Delete,
  FileOutput,
  Loader,
  MessageSquareText,
  Minus,
  Pencil,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";

import { TransactionItem } from "../type";
import { format } from "date-fns";
import { useMeStore } from "@/store/me-store";
import TebleAvatar from "@/components/teble-avatar";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Kutilmoqda",
    className:
      "bg-orange-100 text-orange-600 border-orange-300",
  },
  approved: {
    label: "Tasdiqlangan",
    className:
      "bg-green-100 text-green-600 border-green-300",
  },
  accepted: {
    label: "Tasdiqlangan",
    className:
      "bg-green-100 text-green-600 border-green-300",
  },
  rejected: {
    label: "Rad etilgan",
    className:
      "bg-red-100 text-red-600 border-red-300",
  },
  cancelled: {
    label: "Bekor qilingan",
    className:
      "bg-gray-100 text-gray-600 border-gray-300",
  },
};

export const ReportColumns: ColumnDef<TransactionItem>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-12 h-12 flex items-center justify-center ${item.type === "Приход" ? "bg-[#89A143] text-white" : "bg-[#E38157] text-white"}`}
        >
          {item?.tip === "order" ? (
              item?.type === "Приход"?
                <ShoppingCart  className={`h-6 w-6`} />:
                <Delete className={`h-6 w-6`} />

          ) :
           item?.type === "Приход" ? <Plus className="h-6 w-6 "/> :  <Minus className="h-6 w-6" />
          }
        </div>
      );
    },
  },
  {
    id: "price",
    header:"Наличие",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span
          className={`font-bold text-[16px] ${item.type === "Приход" ? "text-[#89A143]" : "text-[#E38157]"}`}
        >
          {item?.type === "Приход" ? "+" : "-"}
          {item?.tip =="order" && item?.type != "Расход"  ? formatPrice(item?.order?.price || 0) :formatPrice(item?.price || 0) }$
        </span>
      );
    },
  },
  {
    id: "terminal",
    header:"Терминал",
    cell: ({ row }) => {
      const item = row.original;
      return (
        item.type === "Приход"?
        <span
          className={`font-bold text-[16px]  text-[#58A0C6]`}
        >
          { formatPrice(item?.order?.plasticSum || 0)}$
        </span>:""
      );
    },
  },

  {
    id: "type",
    header:"Тип",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <div >
          <Button
          className={`${item?.type !== "Приход" ? "text-[#E38157] border-[#E38157] hover:text-[#E38157]" : "text-[#89A143] border-[#89A143] hover:text-[#89A143]"}  rounded-[70px] p-[14px] h-10 `}
          variant={"outline"}
        >
          {item?.cashflow_type?.title}
        </Button>
      </div>
      );
    },
  },
  {
    id: "comment",
    header:"Подробнее информации",
    cell: ({ row }) => {
      const item = row.original;
      return (
      item.tip == "cashflow" ?   <p className="text-[13px] text-muted-foreground flex gap-1">
      {item?.comment && <MessageSquareText width={14} />}
      {item.product || item?.comment}
    </p>:
    <div className="flex  items gap-10 xl:gap-14">
        <p  className="text-[13px] text-muted-foreground">
            {item.order?.bar_code?.collection?.title}
        </p>
        <p  className="text-[13px] text-muted-foreground">
        { item.order?.bar_code?.model?.title}
        </p>
        <p className="text-[13px] text-muted-foreground">
          {item?.tip === "order" && item?.order?.bar_code?.size?.title}
        </p>
        <p className="text-[13px] text-muted-foreground">
          {item?.tip === "order" && item?.order?.bar_code?.color?.title}
        </p>
        </div>
      );
    },
  },

  {
    id: "quantity",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-muted-foreground">
          {row.original?.tip === "order" && item?.order?.x ?
          ` ${ item?.order?.x } ${ item?.order?.bar_code?.isMetric  ?  ""  :"x"}`
          :
          "" }

        </p>
      );
    },
  },
  {
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-[#E38157]">
          {item?.tip === "order" && item?.order?.discountSum ?    `-${item?.order?.discountSum}$`:''}
        </p>
      );
    },
  },


  {
    id: "filial",
    header:"Филиал",
    cell: ({row}) => {
      const { meUser } = useMeStore();
      const item = row.original;
      return (
        meUser?.position?.role == 10  ||  meUser?.position?.role == 9? <div >
          <Button
          className={`bg-[#E6E6D9] border-0  rounded-[5px] p-[14px] h-10 `}
          variant={"outline"}
        >
          {item?.filial?.name}
        </Button>
      </div>:""
      );
    },
  },
  {
    header: "Продавец",
    id: "seller",
    cell: ({ row }) => {
      const item = row.original;
      return item?.order?.seller?.avatar && <TebleAvatar status={"success"} name={ item?.order?.seller?.firstName} url={item?.order?.seller?.avatar?.path} />

    },
  },
  {
    header: "Менеджер",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return    <TebleAvatar status={item?.order?.status === "rejected" || item?.status === "rejected" ? "fail" : item?.order?.status === "canceled" || item?.is_cancelled ? "return" : "success"} name={ item?.createdBy?.firstName} url={item?.createdBy?.avatar?.path} />



    },
  },
  {
    id: "status",
    header: "Статус",
    cell: ({ row }) => {
      const item = row.original;
      const status = item?.status || "pending";
      const config = statusConfig[status] || statusConfig.pending;

      return (
        <Badge
          variant="outline"
          className={`rounded-[63px] py-[6px] px-[12px] text-[12px] ${config.className}`}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "time",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[13px]">{format(item?.date, "dd MMM HH:mm")}</p>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({row}) => {
      const [loading,setLoading] = useState(false)
      const [approveLoading, setApproveLoading] = useState(false)
      const queryClient = useQueryClient();
      const [, setEditId] = useQueryState("editCashflowId", parseAsString);
      const item = row.original;
      const canUpdate = !item.is_cancelled && item.status !== "cancelled" && item.status !== "rejected" && item.order?.status !== "canceled";

      const RejectFunt = () => {
        setLoading(true);
        const orderId = item?.order?.id;
        if (orderId) {
          PatchData(apiRoutes.order + "/reject/" + orderId, {})
            .then(() => {
              toast.success("Bekor qilindi");
              queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
            })
            .finally(() => setLoading(false));
        } else {
          UpdatePatchData(apiRoutes.cashflow + "/" + row?.original?.id + "", "cancel", {})
            .then(() => {
              toast.success("Bekor qilindi");
              queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
            })
            .finally(() => setLoading(false));
        }
      };

      const ApproveFunt = () => {
        setApproveLoading(true);
        UpdatePatchData(apiRoutes.cashflow + "/" + row?.original?.id + "", "accept", {})
          .then(() => {
            toast.success("Tasdiqlandi");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(() => setApproveLoading(false));
      };

      const ReturnFunt = () => {
        setLoading(true);
        const orderId = item?.order?.id;
        if (orderId) {
          PatchData(apiRoutes.order + "/return/" + orderId, {})
            .then(() => {
              toast.success("Qaytarildi");
              queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
            })
            .finally(() => setLoading(false));
        }
      };

      return(
        <div className="flex items-center gap-1">
          {row?.original?.status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              disabled={approveLoading}
              onClick={approveLoading ? () => {} : () => ApproveFunt()}
              className="text-[#89A143] hover:text-[#89A143] hover:bg-green-50"
              title="Tasdiqlash"
            >
              {approveLoading ? (
                <Loader className="h-7 w-7 animate-spin" />
              ) : (
                <CheckCircle className="h-7 w-7" />
              )}
            </Button>
          )}
          <TableAction
            ShowUpdate={false}
            ShowDelete={row?.original?.tip != "order"}
            url={apiRoutes.cashflow}
            refetchUrl={apiRoutes.cashflow}
            id={row?.original?.id + ""}
          >
          {/* Tahrirlash */}
          {canUpdate && (
            <DropdownMenuItem onClick={() => setEditId(item.id + "")} className="flex items-center gap-2 py-2 cursor-pointer">
              <Pencil className="h-4 w-4" />
              <span className="text-[13px]">Tahrirlash</span>
            </DropdownMenuItem>
          )}
          {/* PENDING order → Bekor qilish */}
          {row?.original?.tip == "order" && row?.original?.status === "pending" && row?.original?.type != "Расход" && (
            <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
              <div
                onClick={loading ? () => {} : () => RejectFunt()}
                className="w-full flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <FileOutput className="h-4 w-4 text-[#FFA500]" />
                )}
                <span className="text-[#FFA500] text-[13px]">Bekor qilish</span>
              </div>
            </DropdownMenuItem>
          )}
          {/* APPROVED order → Qaytarish */}
          {row?.original?.tip == "order" && row?.original?.status === "approved" && row?.original?.order?.status !== "canceled" && row?.original?.type != "Расход" && (
            <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
              <div
                onClick={loading ? () => {} : () => ReturnFunt()}
                className="w-full flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <FileOutput className="h-4 w-4 text-[#EC6C49]" />
                )}
                <span className="text-[#EC6C49] text-[13px]">Qaytarish</span>
              </div>
            </DropdownMenuItem>
          )}
          </TableAction>
        </div>
      )
    },
  },
];
