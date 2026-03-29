import { FileOutput } from "lucide-react";

import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TData } from "../type";

export default function Filters({SortData}:{SortData?:TData}) {
  const { id } = useParams();


  return (
    <div className=" px-[20px] h-[64px] flex  gap-2 mb-2  ">
      {id ? (
        <p className="text-[#272727] text-[20px] mr-auto">{SortData?.fullName}</p>
      ) :""}
     {id ? <Button
        className="h-full   w-[140px]  ml-auto"
        variant={"secondary"}
      >
        <FileOutput /> Экспорт
      </Button>:""}
    
    </div>
  );
}
