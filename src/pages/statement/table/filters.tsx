import {  Plus } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

export default function Filters() {
  const [, setId] = useQueryState("id");

  return (
    <div className="bg-sidebar border-border border-b px-4 h-[64px] flex items-center">
    
      {/* <FilterSelect
        placeholder="Фильтр"
        name="status"
        className="border-x border-border h-full mr-auto mx-4"
        defaultValue="all"
        options={[
          { label: "Все статусы", value: "all" },
          { label: "В процессе", value: "InProgress" },
          { label: "Отправить", value: "Sent" },
          { label: "Отказана", value: "Rejected" },
          { label: "Принято", value: "Accepted" },
        ]}
      /> */}


   

      {/* <Button className="h-full  border-y-0 w-[64px]"  variant={"outline"} ><Trash2/></Button> */}
      {/* <Button className="h-full  border-y-0 w-[140px] "  variant={"outline"} ><FileOutput/> Экспорт</Button> */}
      <Button onClick={() => setId("new")}  className="h-full ml-auto     border-y-0   "  variant={"outline"} ><Plus size={24}/>  Добавить ведомость</Button>
    </div>
  );
}
