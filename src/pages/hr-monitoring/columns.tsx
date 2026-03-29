// monitoring/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { GiftIcon, Wallet } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { MonitoringItem } from "./types";
import ActionBadge from "@/components/actionBadge";

export const MonitoringColumns = (): ColumnDef<MonitoringItem>[] => [
  {
    id: "amount",
    header: "Сумма",
    cell: ({ row }) => {
      const { type, amount } = row.original;
      return (
        <div className="flex items-center">
          {getTypeIcon(row.original.type)}
          {getTypeColor(type, amount)}
        </div>
      );
    },
    size: 50,
  },
  {
    id: "type",
    header: "Тип",
    cell: ({ row }) => {
      return getTypeLabel(row.original.type);
    },
    size: 50,
  },
  {
    id: "condition",
    header: "Условия",
    accessorKey: "condition",
  },
  {
    id: "details",
    header: "Подробнее информации",
    accessorKey: "details",
  },
  {
    id: "dateTime",
    header: "Дата и время",
    cell: ({ row }) => {
      return format(new Date(row.original.dateTime), "dd.MM.yyyy HH:mm");
    },
  },
  {
    id: "employee",
    header: "Сотрудник",
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="bg-primary text-white">
              {employee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{employee.name}</span>
        </div>
      );
    },
  },
  {
    id: "manager",
    header: "Менеджер",
    cell: ({ row }) => {
      const manager = row.original.manager;
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={manager.avatar} />
              <AvatarFallback className="bg-primary text-white">
                {manager.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <ActionBadge status={"accepted"}/>
        </div>
      );
    },
  },
];

// Helper functions for rendering cells
const getTypeIcon = (type: string) => {
  switch (type) {
    case "bonus":
      return (
        <div className="w-12 h-12 mr-2 bg-[#CBB26A] flex items-center justify-center">
          <GiftIcon className="text-white" />
        </div>
      );
    case "salary":
      return (
        <div className="w-12 h-12 mr-2 bg-[#E38157] flex items-center justify-center">
          <Wallet className="text-white" />
        </div>
      );
    case "premium":
      return (
        <div className="w-12 h-12 mr-2 bg-[#89A1C8] flex items-center justify-center">
          <GiftIcon className="text-white" />
        </div>
      );
    default:
      return null;
  }
};

const getTypeColor = (type: string, amount: number) => {
  switch (type) {
    case "bonus":
      return <span className="text-[#CBB26A]">+{amount} $</span>;
    case "salary":
      return <span className="text-[#E38157]">{amount} $</span>;
    case "premium":
      return <span className="text-[#89A1C8]">+{amount} $</span>;
    default:
      return <span>{amount} $</span>;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "bonus":
      return (
        <Badge
          variant="outline"
          className="border-[#C3AD54] !min-w-[93px] !min-h-[38px] text-[#C3AD54] py-3 px-6 rounded-full"
        >
          Бонус
        </Badge>
      );
    case "salary":
      return (
        <Badge
          variant="outline"
          className="border-[#E38157] !min-w-[93px] !min-h-[38px] text-[#E38157]  py-3 px-6 rounded-full"
        >
          Зарплата
        </Badge>
      );
    case "premium":
      return (
        <Badge
          variant="outline"
          className="border-[#94C3DC] !min-w-[93px] !min-h-[38px] text-[#94C3DC]  py-3 px-6 rounded-full"
        >
          Премье
        </Badge>
      );
    default:
      return null;
  }
};


