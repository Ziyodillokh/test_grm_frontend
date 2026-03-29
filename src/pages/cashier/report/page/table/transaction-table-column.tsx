import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define the transaction data structure
export interface TransactionData {
  id: string | number;
  date: string;
  sum: string;
  terminal: string;
  discount: string;
  navar: string;
  volume: string;
  income: string;
  expense: string;
  inkassation: string;
  isFirstRow?: boolean;
}

export const getTransactionColumns = (): ColumnDef<TransactionData>[] => [
  {
    accessorKey: "date",
    header: "Дата",
    cell: ({ row }) => {
      const isFirstRow = row.original.isFirstRow;
      return (
        <div className={isFirstRow ? "text-green-600" : ""}>
          {row.getValue("date")}
        </div>
      );
    },
  },
  {
    accessorKey: "sum",
    header: "Сумма",
  },
  {
    accessorKey: "terminal",
    header: "Терминал",
  },
  {
    accessorKey: "discount",
    header: "Скидка",
    cell: ({ row }) => {
      const isSpecialDiscount = row.original.discount.includes("289");
      return (
        <div className={isSpecialDiscount ? "text-orange-500" : ""}>
          {row.getValue("discount")}
        </div>
      );
    },
  },
  {
    accessorKey: "navar",
    header: "Навар",
  },
  {
    accessorKey: "volume",
    header: "Объём",
  },
  {
    accessorKey: "income",
    header: "Приход",
  },
  {
    accessorKey: "expense",
    header: "Расход",
    cell: ({ row }) => (
      <div className="text-orange-500">{row.getValue("expense")}</div>
    ),
  },
  {
    accessorKey: "inkassation",
    header: "Инкассация",
    cell: ({ row }) => (
      <div className="flex items-center justify-between">
        <span>{row.getValue("inkassation")}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Детали</DropdownMenuItem>
            <DropdownMenuItem>Изменить</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];