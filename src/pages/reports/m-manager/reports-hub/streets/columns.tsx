import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import { StreetReportItem, StreetDetailItem } from "./type";

export const StreetColumns: ColumnDef<StreetReportItem>[] = [
  {
    header: "№",
    cell: ({ row }) => <p>{row.original?.number_debt}</p>,
  },
  {
    header: "Ism",
    cell: ({ row }) => (
      <p className="font-medium">{row.original?.fullName}</p>
    ),
  },
  {
    header: "Telefon",
    cell: ({ row }) => <p>{row.original?.phone}</p>,
  },
  {
    header: "Olingan",
    cell: ({ row }) => (
      <p className="text-[#FF6600] font-medium">
        {formatPrice(row.original?.owed || 0)} $
      </p>
    ),
  },
  {
    header: "Qaytarilgan",
    cell: ({ row }) => (
      <p className="text-[#89A143] font-medium">
        {formatPrice(row.original?.given || 0)} $
      </p>
    ),
  },
  {
    header: "Qolgan",
    cell: ({ row }) => (
      <p className="font-bold">
        {formatPrice(row.original?.totalDebt || 0)} $
      </p>
    ),
  },
  {
    header: "Davriy olingan",
    cell: ({ row }) => (
      <p className="text-[#89A143]">
        {formatPrice(row.original?.period_income || 0)} $
      </p>
    ),
  },
  {
    header: "Davriy qaytarilgan",
    cell: ({ row }) => (
      <p className="text-[#FF6600]">
        {formatPrice(row.original?.period_expense || 0)} $
      </p>
    ),
  },
];

export const StreetDetailColumns: ColumnDef<StreetDetailItem>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-10 h-10 flex items-center justify-center rounded ${
            item.type === "income"
              ? "bg-[#89A143] text-white"
              : "bg-[#E38157] text-white"
          }`}
        >
          {item.type === "income" ? (
            <Plus className="h-5 w-5" />
          ) : (
            <Minus className="h-5 w-5" />
          )}
        </div>
      );
    },
  },
  {
    id: "price",
    header: "Summa",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span
          className={`font-bold text-[15px] ${
            item.type === "income" ? "text-[#89A143]" : "text-[#E38157]"
          }`}
        >
          {item.type === "income" ? "+" : "-"}
          {formatPrice(item?.price || 0)} $
        </span>
      );
    },
  },
  {
    id: "type",
    header: "Turi",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          className={`${
            item.type !== "income"
              ? "text-[#E38157] border-[#E38157] hover:text-[#E38157]"
              : "text-[#89A143] border-[#89A143] hover:text-[#89A143]"
          } rounded-[70px] p-[14px] h-8`}
          variant="outline"
        >
          {item.cashflow_type?.title}
        </Button>
      );
    },
  },
  {
    id: "date",
    header: "Sana",
    cell: ({ row }) => (
      <p className="text-[13px] min-w-[80px]">
        {format(new Date(row.original?.date), "dd MMM HH:mm")}
      </p>
    ),
  },
  {
    id: "comment",
    header: "Izoh",
    cell: ({ row }) => (
      <p className="text-[13px] text-muted-foreground">
        {row.original?.comment || ""}
      </p>
    ),
  },
  {
    id: "createdBy",
    header: "Kim qo'shgan",
    cell: ({ row }) => {
      const user = row.original?.createdBy;
      return (
        <p className="text-[13px]">
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </p>
      );
    },
  },
];
