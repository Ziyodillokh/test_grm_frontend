import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { ListRow } from "@/components/ui/list-row";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRoutes } from "@/service/apiRoutes";
import { PatchData, UpdatePatchData } from "@/service/apiHelpers";
import { useMeStore } from "@/store/me-store";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import type { TransactionItem } from "@/pages/cashflow/types";

export const cashflowGridTemplate = "60px 60px 120px 120px 1fr 70px";
export const cashflowLabels = [
  { text: "Summa", right: true },
  { text: "Status", center: true },
  { text: "Turi", center: false },
  { text: "Sana", center: false },
  { text: "Malumotlar", center: false },
  { text: "", center: false },
];

function getCashflowAvatar(item: TransactionItem): { name: string; url?: string; status: string } {
  const isOrder = item.tip === "order";
  const isIncome = item.type === "income";

  if (isOrder && !isIncome && item.order?.status === "returned") {
    return {
      name: item.createdBy?.firstName || "?",
      url: item.createdBy?.avatar?.path,
      status: "return",
    };
  }

  if (isOrder && item.order?.seller) {
    if (item.order?.status === "rejected" || item.status === "rejected" || item.isCancelled) {
      return {
        name: item.order.seller.firstName,
        url: item.order.seller.avatar?.path,
        status: "fail",
      };
    }
    if (item.status === "approved" || item.order?.status === "accepted") {
      return {
        name: item.order.seller.firstName,
        url: item.order.seller.avatar?.path,
        status: "success",
      };
    }
    return {
      name: item.order.seller.firstName,
      url: item.order.seller.avatar?.path,
      status: "panding",
    };
  }

  if (item.isCancelled || item.status === "rejected" || item.status === "cancelled") {
    return {
      name: item.createdBy?.firstName || "?",
      url: item.createdBy?.avatar?.path,
      status: "fail",
    };
  }
  return {
    name: item.createdBy?.firstName || "?",
    url: item.createdBy?.avatar?.path,
    status: "success",
  };
}

interface CashflowRowProps {
  item: TransactionItem;
  onEdit?: (item: TransactionItem) => void;
  onDelete?: (item: TransactionItem) => void;
}

export function CashflowRow({ item, onEdit, onDelete }: CashflowRowProps) {
  const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isFManager = role === 4;
  const isOrder = item.tip === "order";
  const isIncome = item.type === "income";
  const avatar = getCashflowAvatar(item);

  const cashPrice = isOrder && isIncome ? (item.order?.price || 0) : (isOrder ? (item.order?.price || 0) : (item.price || 0));
  const terminalPrice = isOrder && isIncome ? (item.order?.plasticSum || 0) : 0;

  const typeName = item.cashflow_type?.title || (isOrder ? "Order" : "—");
  const typeColor = isIncome ? "#3ABC49" : "#EF5C12";

  const dateStr = item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—";

  const barCode = item.order?.bar_code;
  const additionalProfit = item.order?.additionalProfit ?? item.order?.additionalProfitSum ?? 0;
  const discount = item.order?.discount ?? item.order?.discountSum ?? 0;

  // F-Manager actions
  const [approveLoading, setApproveLoading] = useState(false);
  const canApprove = isFManager && isOrder && item.status === "pending" && isIncome;

  const handleApprove = () => {
    setApproveLoading(true);
    UpdatePatchData(apiRoutes.cashflow + "/" + item.id, "accept", {})
      .then(() => {
        toast.success("Tasdiqlandi");
        queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
        queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] });
      })
      .finally(() => setApproveLoading(false));
  };

  const [actionLoading, setActionLoading] = useState(false);
  const canReject = isOrder && item.status === "pending" && isIncome;
  const canReturn = isOrder && item.status === "approved" && item.order?.status !== "returned" && isIncome;
  const canCancel = !isOrder && !item.isCancelled && item.status !== "cancelled";

  const handleReject = () => {
    setActionLoading(true);
    const orderId = item.order?.id;
    if (orderId) {
      PatchData(apiRoutes.order + "/reject/" + orderId, {})
        .then(() => { toast.success("Bekor qilindi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] }); })
        .finally(() => setActionLoading(false));
    }
  };

  const handleReturn = () => {
    setActionLoading(true);
    const orderId = item.order?.id;
    if (orderId) {
      PatchData(apiRoutes.order + "/return/" + orderId, {})
        .then(() => { toast.success("Qaytarildi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] }); })
        .finally(() => setActionLoading(false));
    }
  };

  const handleCancel = () => {
    setActionLoading(true);
    UpdatePatchData(apiRoutes.cashflow + "/" + item.id, "cancel", {})
      .then(() => { toast.success("Bekor qilindi"); queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] }); queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] }); })
      .finally(() => setActionLoading(false));
  };

  // Edit/Delete actions (myCashFlow uchun)
  const canEditDelete = !!onEdit || !!onDelete;
  const canEditItem = onEdit && !isOrder;

  return (
    <ListRow gridTemplate={cashflowGridTemplate} gridGap="16px">
      {/* Summa */}
      <div className="text-right">
        <span className={`text-[15px] font-medium ${isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
          {isIncome ? "+" : "-"} {formatPrice(cashPrice)}
        </span>
        {terminalPrice > 0 && (
          <p className="text-[15px] font-medium text-[#0078D4]">
            + {formatPrice(terminalPrice)}
          </p>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center justify-center">
        <TebleAvatar
          size={42}
          name={avatar.name}
          url={avatar.url}
          status={avatar.status}
        />
      </div>

      {/* Turi */}
      <div className="flex items-center gap-[6px]">
        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
        <span className="text-[13px] font-medium text-[#1a1a1a]">{typeName}</span>
      </div>

      {/* Sana */}
      <span className="text-[13px] text-[#1a1a1a]">{dateStr}</span>

      {/* Malumotlar */}
      <div className="flex items-center gap-[16px] text-[13px] text-[#1a1a1a] overflow-hidden">
        {isOrder && barCode ? (
          <>
            <span>{barCode.collection?.title}</span>
            <span>{barCode.model?.title}</span>
            <span>{barCode.size?.title}</span>
            <span>{barCode.color?.title}</span>
            <span>${formatPrice(barCode.collection?.collection_prices?.[0]?.priceMeter || barCode.collection?.priceMeter || 0)}</span>
            <span>{barCode.isMetric ? `${item.order?.kv || 0}sm` : `${item.order?.x || 0}x`}</span>
            {additionalProfit > 0 && (
              <span className="text-[#47B13C] font-medium">+{formatPrice(additionalProfit)}$</span>
            )}
            {discount > 0 && (
              <span className="text-[#EF5C12] font-medium">-{formatPrice(discount)}$</span>
            )}
          </>
        ) : (
          <span className="truncate">{item.comment || item.product || "—"}</span>
        )}
      </div>

      {/* Action */}
      <div className="flex items-center justify-end gap-[4px]">
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={approveLoading}
            className="w-[42px] h-[42px] rounded-full bg-[#47B13C] flex items-center justify-center shrink-0 hover:bg-[#3da032] transition-colors disabled:opacity-50"
          >
            {approveLoading ? (
              <Loader className="w-[18px] h-[18px] text-white animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip_chk)">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 3L9 10.5075L6.75 8.2575" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs><clipPath id="clip_chk"><rect width="18" height="18" fill="white"/></clipPath></defs>
              </svg>
            )}
          </button>
        )}

        {/* F-Manager dropdown */}
        {isFManager && !canEditDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
                <MoreVertical className="w-[16px] h-[16px] text-[#A3A3A3]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canReject && (
                <DropdownMenuItem disabled={actionLoading} onClick={handleReject}>
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                  Bekor qilish
                </DropdownMenuItem>
              )}
              {canReturn && (
                <DropdownMenuItem disabled={actionLoading} onClick={handleReturn}>
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                  Qaytarish
                </DropdownMenuItem>
              )}
              {canCancel && (
                <DropdownMenuItem disabled={actionLoading} onClick={handleCancel}>
                  {actionLoading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                  Bekor qilish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Edit/Delete dropdown (myCashFlow) */}
        {canEditDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
                <MoreVertical className="w-[16px] h-[16px] text-[#A3A3A3]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEditItem && (
                <DropdownMenuItem onClick={() => onEdit?.(item)}>
                  Tahrirlash
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete?.(item)}>
                  O'chirish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </ListRow>
  );
}
