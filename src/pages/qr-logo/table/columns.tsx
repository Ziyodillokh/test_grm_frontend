import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { QrLogo } from "../type";
import { useToggleQrLogoStatus } from "./queries";

export const QrLogoColumns: ColumnDef<QrLogo>[] = [
  {
    id: "index",
    header: "№",
    cell: ({ row }) => (
      <p className="text-[14px] font-medium">{row.index + 1}</p>
    ),
  },
  {
    id: "qrCode",
    header: "QR код",
    cell: ({ row }) => {
      const item = row.original;
      return item.qrDataUrl ? (
        <img
          src={item.qrDataUrl}
          alt="QR"
          className="w-[50px] h-[50px] object-contain"
        />
      ) : (
        <div className="w-[50px] h-[50px] bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
          N/A
        </div>
      );
    },
  },
  {
    id: "link",
    header: "Ссылка",
    cell: ({ row }) => (
      <p className="text-[13px] text-muted-foreground max-w-[300px] truncate">
        {row.original.link}
      </p>
    ),
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) => (
      <p className="text-[13px] text-muted-foreground max-w-[200px] truncate">
        {row.original.description || "—"}
      </p>
    ),
  },
  {
    id: "status",
    header: "Статус",
    cell: ({ row }) => {
      const active = row.original.is_active;
      return (
        <Badge
          variant="outline"
          className={`rounded-[63px] py-[6px] px-[12px] text-[12px] ${
            active
              ? "bg-green-100 text-green-600 border-green-300"
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
        >
          {active ? "Активно" : "Закрыт"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const { mutate, isPending } = useToggleQrLogoStatus();
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => mutate(item.id)}
            >
              {item.is_active ? "Закрыть" : "Активировать"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
