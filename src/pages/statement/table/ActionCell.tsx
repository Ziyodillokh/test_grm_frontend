import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Statement } from "../type";

interface ActionCellProps {
  row: Row<Statement>;
  onDeleteClick: (id: string) => void;
  onEditClick: (id: string) => void;
}

export const ActionCell = ({ row, onDeleteClick }: ActionCellProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          navigate(`/statement/${row.original.id}/info`);
        }}>
          Подробности
        </DropdownMenuItem>

        {/* <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onEditClick(String(row.original.id));
        }}>
          Редактировать
        </DropdownMenuItem> */}

        <DropdownMenuItem
          className="text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(String(row.original.id));
          }}
        >
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};