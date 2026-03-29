import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";

export const StatusBadge = ({ status,onClick,isPending }: {isPending:boolean, status: string,onClick:MouseEventHandler<HTMLSpanElement> }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (status) {
    case "Sent":
      variant = "default"; // Green
      break;
    case "В процессе":
      variant = "outline"; // Outlined in orange
      break;
    case "Отказана":
      variant = "default"; // Red
      break;
    case "Принято":
      variant = "secondary"; // Gray
      break;
    default:
      variant = "default";
  }

  const {t}= useTranslation()
  return (
    <Badge
      variant={variant}
      onClick={onClick}
      
      // dia={isPending}
      className={`${isPending ? "opacity-40":""} min-w-[93px] py-[12px] rounded-full px-[16px] gap-[10px] justify-center ${status === "Sent" ? "bg-[#89A143] text-white" : status === "Отказана" ? "bg-[#E38157] text-white border-[#E38157]" : status === "В процессе" ? "border-[#E38157] text-[#E38157]" : "border-[#CBCBC1] text-[#CBCBC1]"}`}
    >
     {isPending && <Loader2/>}  {t(status)}
    </Badge>
  );
};
