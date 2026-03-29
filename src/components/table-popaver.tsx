import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Info } from "lucide-react";

interface ITablePopaver {
  text: string;
  disc: string;
}
export default function TablePopaver({ text, disc }: ITablePopaver) {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer gap-1 flex items-center ">
        {t(text)}
        <Info size={18} className="text-primary" />
      </PopoverTrigger>
      <PopoverContent>{disc}</PopoverContent>
    </Popover>
  );
}
