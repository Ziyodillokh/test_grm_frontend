import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface IActionBadgeProps {
  childen?: React.ReactNode;
  status: "accept" | "reject" | "complete" | string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  btnText?:string;
}

const ColorStatus = {
  accept: "#89A143",
  reject: "##F05B58",
  complete: "#212121",
};

const statusObj = {
  accept: "Принять",
  reject: "Отменеть",
  complete: "Завершеть",
  
};
export default function ActionButton({ childen,btnText,isLoading,disabled,onClick, status }: IActionBadgeProps) {
  return (
    <Button
    disabled={disabled|| isLoading}
    onClick={onClick }
    type="button"
      className={`min-w-[100px] border-[${ColorStatus?.[status as keyof typeof statusObj]}] text-white  bg-[${ColorStatus?.[status as keyof typeof statusObj]}]  hover:bg-[${ColorStatus?.[status as keyof typeof statusObj]}]  cursor-pointer py-[10px] px-[14px] rounded-[63px]`}
    >
     {isLoading ? <Loader className="animate-spin"/>:""}  {btnText || childen || statusObj?.[status as keyof typeof statusObj]}
    </Button>
  );
}
