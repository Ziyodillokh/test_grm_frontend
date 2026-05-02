import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TebleAvatar from "@/components/teble-avatar";
import formatPrice from "@/utils/formatPrice";
import { apiRoutes } from "@/service/apiRoutes";
import { UpdatePatchData } from "@/service/apiHelpers";

export const CashflowColumns: ColumnDef<any>[] = [
  {
    id: "summa",
    header: "Summa",
    cell: ({ row }) => {
      const item = row.original;
      const isIncome = item?.type === "Приход";
      const price = item?.price || item?.order?.price || 0;
      const terminal = item?.order?.plasticSum || 0;

      return (
        <div>
          <p className={`font-semibold text-[15px] ${isIncome ? "text-[#89A143]" : "text-[#E38157]"}`}>
            {isIncome ? "+" : "-"} {formatPrice(price)}$
          </p>
          {item?.tip === "order" && terminal > 0 && (
            <p className="text-[#58A0C6] text-[13px]">+ {formatPrice(terminal)}</p>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center -space-x-1">
          {item?.order?.seller?.avatar && (
            <TebleAvatar status="success" name={item?.order?.seller?.firstName} url={item?.order?.seller?.avatar?.path} />
          )}
          <TebleAvatar
            status={item?.isCancelled ? "fail" : "success"}
            name={item?.createdBy?.firstName}
            url={item?.createdBy?.avatar?.path}
          />
        </div>
      );
    },
  },
  {
    id: "turi",
    header: "Turi",
    cell: ({ row }) => {
      const item = row.original;
      const isIncome = item?.type === "Приход";
      const dotColor = item?.tip === "order" ? "bg-[#89A143]" : isIncome ? "bg-[#89A143]" : "bg-[#E38157]";

      return (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className="text-[14px]">{item?.cashflow_type?.title || item?.tip}</span>
        </div>
      );
    },
  },
  {
    id: "sana",
    header: "Sana",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[13px] text-muted-foreground">{format(new Date(item?.date), "dd MMM HH:mm")}</p>;
    },
  },
  {
    id: "malumotlar",
    header: "Malumotlar",
    cell: ({ row }) => {
      const item = row.original;
      if (item?.tip === "order" && item?.order) {
        const o = item.order;
        return (
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <span>{o?.bar_code?.collection?.title}</span>
            <span>{o?.bar_code?.model?.title}</span>
            <span>{o?.bar_code?.size?.title}</span>
            <span>${o?.price}</span>
            <span>{o?.kv ? `${o.kv.toFixed(0)}sm` : ""}</span>
            {o?.additionalProfitSum > 0 && <span className="text-[#89A143]">+{o.additionalProfitSum.toFixed(2)}$</span>}
            {o?.discountSum > 0 && <span className="text-[#E38157]">-{o.discountSum}$</span>}
          </div>
        );
      }
      return <p className="text-[13px] text-muted-foreground">{item?.comment}</p>;
    },
  },
  {
    id: "harakatlar",
    header: "Harakatlar",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const [approveLoading, setApproveLoading] = useState(false);
      const queryClient = useQueryClient();
      const item = row.original;

      const cancelFn = () => {
        setLoading(true);
        UpdatePatchData(apiRoutes.cashflow + "/" + item?.id, "cancel", {})
          .then(() => {
            toast.success("Bajarildi");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(() => setLoading(false));
      };

      const approveFn = () => {
        setApproveLoading(true);
        UpdatePatchData(apiRoutes.cashflow + "/" + item?.id, "accept", {})
          .then(() => {
            toast.success("Tasdiqlandi");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(() => setApproveLoading(false));
      };

      return (
        <div className="flex items-center gap-1">
          {item?.status === "pending" && (
            <Button
              variant="ghost" size="icon"
              disabled={approveLoading}
              onClick={approveFn}
              className="text-[#89A143] hover:text-[#89A143] hover:bg-green-50"
            >
              {approveLoading ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item?.tip === "order" && item?.status === "pending" && (
                <DropdownMenuItem onClick={cancelFn} className="text-[#FFA500]">
                  {loading ? "..." : "✕ Bekor qilish"}
                </DropdownMenuItem>
              )}
              {item?.tip === "order" && item?.status === "approved" && (
                <DropdownMenuItem onClick={cancelFn} className="text-[#E38157]">
                  {loading ? "..." : "↩ Qaytarish"}
                </DropdownMenuItem>
              )}
              {item?.tip !== "order" && (
                <DropdownMenuItem onClick={cancelFn} className="text-red-500">
                  {loading ? "..." : "🗑 O'chirish"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
