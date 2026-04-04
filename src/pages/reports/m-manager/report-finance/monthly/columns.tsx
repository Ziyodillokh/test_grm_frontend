import { ColumnDef } from "@tanstack/react-table";
import { MonthsArray } from "@/consts";
import { TKassareportData } from "../type";
import { Badge } from "@/components/ui/badge";
import TebleAvatar from "@/components/teble-avatar";
import { minio_img_url } from "@/constants";

function getStatusBadge(item: TKassareportData) {
  if (item?.status === "accepted")
    return { label: "Tasdiqlangan", dot: "bg-green-500", cls: "text-green-700 border-green-300 bg-green-50" };
  if (item?.isManagerRejected || item?.isAccountantRejected)
    return { label: "Qaytarilgan", dot: "bg-red-500", cls: "text-red-700 border-red-300 bg-red-50" };
  if (item?.status === "closed")
    return { label: "Yopilgan", dot: "bg-blue-500", cls: "text-blue-700 border-blue-300 bg-blue-50" };
  if (item?.reportStatus === 2)
    return { label: "Jarayonda...", dot: "bg-green-400", cls: "text-green-700 border-green-300 bg-green-50" };
  return { label: "Kutilayotgan", dot: "bg-yellow-500", cls: "text-yellow-700 border-yellow-300 bg-yellow-50" };
}

export const MonthlyColumns: ColumnDef<TKassareportData>[] = [
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
      const item = row.original;
      return (
        <div className="flex items-center -space-x-2">
          {item?.isMManagerConfirmed !== undefined && (
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${item.isMManagerConfirmed ? "bg-[#89A143]" : item.isManagerRejected ? "bg-red-500" : "bg-gray-300"}`}>
                M
              </div>
            </div>
          )}
          {item?.isAccountantConfirmed !== undefined && (
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${item.isAccountantConfirmed ? "bg-[#89A143]" : item.isAccountantRejected ? "bg-red-500" : "bg-gray-300"}`}>
                A
              </div>
            </div>
          )}
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
    id: "month",
    header: "Oy",
    cell: ({ row }) => {
      const month = row.original?.month;
      return <p className="font-medium">{month ? MonthsArray[month - 1]?.label : "—"}</p>;
    },
  },
  {
    id: "sale",
    header: "Savdo",
    cell: ({ row }) => {
      const val = row.original?.totalSale ?? row.original?.sale ?? 0;
      return <p>{val.toLocaleString()}$</p>;
    },
  },
  {
    id: "terminal",
    header: "Terminal",
    cell: ({ row }) => {
      const val = row.original?.totalPlasticSum ?? row.original?.plasticSum ?? 0;
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
      const val = row.original?.totalCashCollection ?? row.original?.cash_collection ?? 0;
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
      const val = row.original?.totalDiscount ?? row.original?.discount ?? 0;
      return <p className="text-red-500">-{Math.abs(val).toFixed(2)}$</p>;
    },
  },
];
