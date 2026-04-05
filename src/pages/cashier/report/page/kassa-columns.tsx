import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  FileOutput,
  Loader,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";

import { TransactionItem } from "../type";
import { format } from "date-fns";
import TebleAvatar from "@/components/teble-avatar";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { UpdatePatchData } from "@/service/apiHelpers";
import { useQueryClient } from "@tanstack/react-query";

export const KassaPageColumns: ColumnDef<TransactionItem>[] = [
  {
    id: "summa",
    header: "Summa",
    cell: ({ row }) => {
      const item = row.original;
      const isIncome = item.type === "Приход";
      const mainPrice =
        item?.tip === "order" && item?.type !== "Расход"
          ? item?.order?.price || 0
          : item?.price || 0;
      const navar =
        item?.tip === "order" && isIncome
          ? item?.order?.additionalProfitSum || 0
          : 0;

      return (
        <div>
          <span
            className={`font-bold text-[15px] ${isIncome ? "text-[#89A143]" : "text-[#E38157]"}`}
          >
            {isIncome ? "+" : "-"} {formatPrice(mainPrice)}
          </span>
          {navar > 0 && (
            <p className="text-[13px] text-[#89A143]">+ {formatPrice(navar)}</p>
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
        <TebleAvatar
          status={item?.is_cancelled ? "fail" : "success"}
          name={item?.casher?.firstName}
          url={item?.casher?.avatar?.path}
        />
      );
    },
  },
  {
    id: "turi",
    header: "Turi",
    cell: ({ row }) => {
      const item = row.original;
      const isIncome = item.type === "Приход";
      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isIncome ? "bg-[#89A143]" : "bg-[#E38157]"}`}
          />
          <span className="text-[14px]">{item?.cashflow_type?.title}</span>
        </div>
      );
    },
  },
  {
    id: "sana",
    header: "Sana",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-muted-foreground">
          {format(item?.date, "dd MMM HH:mm")}
        </p>
      );
    },
  },
  {
    id: "malumotlar",
    header: "Malumotlar",
    cell: ({ row }) => {
      const item = row.original;
      if (item.tip === "cashflow") {
        return (
          <p className="text-[13px] text-muted-foreground">
            {item?.comment || item?.product}
          </p>
        );
      }
      return (
        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
          <span>{item.order?.bar_code?.collection?.title}</span>
          <span>{item.order?.bar_code?.model?.title}</span>
          <span>
            {item.order?.x
              ? `${item.order.x}${item.order.bar_code?.isMetric ? "" : "x"}`
              : ""}
          </span>
          <span>{item.order?.price ? `$${formatPrice(item.order.price)}` : ""}</span>
          <span>
            {item.order?.bar_code?.size?.kv
              ? `${item.order.bar_code.size.kv}sm`
              : ""}
          </span>
          {item.order?.discountSum ? (
            <span className="text-[#E38157]">
              -{item.order.discountSum}$
            </span>
          ) : item.order?.additionalProfitSum ? (
            <span className="text-[#89A143]">
              +{item.order.additionalProfitSum}$
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    id: "harakatlar",
    header: "",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const [approveLoading, setApproveLoading] = useState(false);
      const queryClient = useQueryClient();

      const RejectFunt = () => {
        setLoading(true);
        UpdatePatchData(
          apiRoutes.cashflow + "/" + row?.original?.id + "",
          "cancel",
          {}
        )
          .then(() => {
            toast.success("Bekor qilindi");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(() => setLoading(false));
      };

      const ApproveFunt = () => {
        setApproveLoading(true);
        UpdatePatchData(
          apiRoutes.cashflow + "/" + row?.original?.id + "",
          "accept",
          {}
        )
          .then(() => {
            toast.success("Tasdiqlandi");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(() => setApproveLoading(false));
      };

      return (
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
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </Button>
          )}
          <TableAction
            ShowUpdate={false}
            ShowDelete={row?.original?.tip !== "order"}
            url={apiRoutes.cashflow}
            refetchUrl={apiRoutes.cashflow}
            id={row?.original?.id + ""}
          >
            {/* PENDING order → Bekor qilish */}
            {row?.original?.tip === "order" &&
              row?.original?.status === "pending" &&
              row?.original?.type !== "Расход" && (
                <DropdownMenuItem className="text-center flex items-center justify-center gap-2 py-2">
                  <div
                    onClick={loading ? () => {} : () => RejectFunt()}
                    className="w-full flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileOutput className="h-4 w-4 text-[#FFA500]" />
                    )}
                    <span className="text-[13px]">Bekor qilish</span>
                  </div>
                </DropdownMenuItem>
              )}
            {/* APPROVED order → Qaytarish */}
            {row?.original?.tip === "order" &&
              row?.original?.status === "approved" &&
              row?.original?.type !== "Расход" && (
                <DropdownMenuItem className="text-center flex items-center justify-center gap-2 py-2">
                  <div
                    onClick={loading ? () => {} : () => RejectFunt()}
                    className="w-full flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileOutput className="h-4 w-4 text-[#EC6C49]" />
                    )}
                    <span className="text-[13px]">Qaytarish</span>
                  </div>
                </DropdownMenuItem>
              )}
          </TableAction>
        </div>
      );
    },
  },
];
