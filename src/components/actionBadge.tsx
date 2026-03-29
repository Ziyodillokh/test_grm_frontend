import React from "react";
import { Badge } from "./ui/badge";

interface IActionBadgeProps {
  childen?: React.ReactNode;
  status:
    | "accepted"
    | "rejected"
    | "pending"
    | "new"
    | "completed"
    | "inProgress"
    | "open"
    | "willSell"
    | string;
}

const ColorStatus = {
  accepted: "#212121",
  rejected: "#F05B58",
  open:"#212121",
  pending: "#FFA500",
  new: "#FFA500",
  completed: "#212121",
  closed:"#212121",
  inprogress: "#89A143",
};

const statusObj = {
  accepted: "Принято",
  rejected: "Отменено",
  pending: "В ожидании",
  new: "Новое",
  open:"Открыто",
  completed: "Завершено",
  closed:"Закрыто",
  inprogress: "В процессе",
};
export default function ActionBadge({ childen, status }: IActionBadgeProps) {
  return status == "willSell" ? (
    <Badge
      variant="outline"
      className={`min-w-[100px] border-none text-[#89A143] p-0 rounded-[63px]`}
    >
      Продалажется
    </Badge>
    ) : (
    <Badge
      variant="outline"
      className={`min-w-[100px] border-[${ColorStatus?.[status as keyof typeof statusObj]}]  text-[${ColorStatus?.[status as keyof typeof statusObj]}]  py-[10px] px-[14px] rounded-[63px]`}
    >
      {childen || statusObj?.[status.toLocaleLowerCase() as keyof typeof statusObj]}
    </Badge>
  );
}
