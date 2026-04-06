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
      const isOrder = item.tip === "order";

      if (isOrder && isIncome) {
        const cashPrice = item.order?.price || 0;
        const terminalPrice = item.order?.plasticSum || 0;

        return (
          <div>
            {cashPrice > 0 && (
              <p className="font-bold text-[15px] text-foreground">
                + {formatPrice(cashPrice)}
              </p>
            )}
            {terminalPrice > 0 && (
              <p className="font-bold text-[13px] text-[#58A0C6]">
                + {formatPrice(terminalPrice)}
              </p>
            )}
          </div>
        );
      }

      // Cashflow yoki Расход order
      const price = isOrder ? item.order?.price || 0 : item?.price || 0;
      return (
        <span
          className={`font-bold text-[15px] ${isIncome ? "text-foreground" : "text-[#E38157]"}`}
        >
          {isIncome ? "+" : "-"} {formatPrice(price)}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      const isOrder = item.tip === "order";

      if (isOrder && item.order?.seller) {
        return (
          <div className="flex items-center -space-x-2">
            {/* Seller avatar — doim ko'rinadi */}
            <TebleAvatar
              status="success"
              name={item.order.seller.firstName}
              url={item.order.seller.avatar?.path}
            />
            {/* F-Manager avatar — progress dan boshqa har qanday holatda */}
            {item.order?.status !== "progress" && item.createdBy && (
              <TebleAvatar
                status={item.is_cancelled ? "fail" : "success"}
                name={item.createdBy.firstName}
                url={item.createdBy.avatar?.path}
              />
            )}
          </div>
        );
      }

      // Cashflow (order bo'lmagan) — createdBy avatari
      return (
        <TebleAvatar
          status={item?.is_cancelled ? "fail" : "success"}
          name={item?.createdBy?.firstName}
          url={item?.createdBy?.avatar?.path}
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

      // Order malumotlari
      const order = item.order;
      const barCode = order?.bar_code;
      const additionalProfit = order?.additionalProfitSum || 0;
      const discount = order?.discountSum || 0;

      return (
        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
          <span>{barCode?.collection?.title}</span>
          <span>{barCode?.model?.title}</span>
          <span>{barCode?.size?.title}</span>
          <span>${formatPrice(barCode?.collection?.collection_prices?.[0]?.priceMeter || barCode?.collection?.priceMeter || 0)}</span>
          <span>
            {barCode?.isMetric ? `${order?.kv || 0}sm` : `${order?.x || 0}x`}
          </span>
          {additionalProfit > 0 && (
            <span className="text-[#89A143] font-medium">
              +{formatPrice(additionalProfit)}$
            </span>
          )}
          {discount > 0 && (
            <span className="text-[#E38157] font-medium">
              -{formatPrice(discount)}$
            </span>
          )}
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
            queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
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
            queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
            queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] });
          })
          .finally(() => setApproveLoading(false));
      };

      return (
        <div className="flex items-center gap-1">
          {row?.original?.tip === "order" &&
            row?.original?.status === "pending" &&
            row?.original?.type !== "Расход" && (
              <Button
                variant="ghost"
                size="icon"
                disabled={approveLoading}
                onClick={approveLoading ? () => {} : () => ApproveFunt()}
                className="text-[#89A143] hover:text-[#89A143] hover:bg-green-50 rounded-full w-10 h-10"
                title="Tasdiqlash"
              >
                {approveLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}
              </Button>
            )}
          <TableAction
            ShowUpdate={false}
            ShowDelete={row?.original?.tip !== "order" || row?.original?.is_cancelled}
            url={apiRoutes.cashflow}
            refetchUrl={apiRoutes.cashflow}
            id={row?.original?.id + ""}
          >
            {/* PENDING order → Bekor qilish */}
            {row?.original?.tip === "order" &&
              row?.original?.status === "pending" &&
              row?.original?.type !== "Расход" && (
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
                    <span className="text-[13px]">Bekor qilish</span>
                  </div>
                </DropdownMenuItem>
              )}
            {/* APPROVED order → Qaytarish */}
            {row?.original?.tip === "order" &&
              row?.original?.status === "approved" &&
              row?.original?.type !== "Расход" && (
                <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
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
