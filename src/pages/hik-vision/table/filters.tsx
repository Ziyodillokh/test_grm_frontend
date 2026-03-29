import {  Archive, FileOutput, Plus, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";

import SearchInput from "@/components/filters-ui/search-input";
import Statistics from "@/components/filters-ui/statistics";
import { Button } from "@/components/ui/button";

export default function Filters() {
  const [, setId] = useQueryState("id");
  return (
    <div className="  px-[20px] h-[64px]   flex gap-2 mb-2   ">
      <SearchInput className="mr-auto w-full" />
      <Statistics/>
      <Button className="h-full  w-[64px]"  variant={"secondary"} ><Trash2/></Button>
      <Button className="h-full  w-[64px]  "  variant={"secondary"} ><Archive/></Button>
      <Button className="h-full   w-[140px] "  variant={"secondary"} ><FileOutput/> Экспорт</Button>
      <Button onClick={() => setId("new")}  className="h-full     "  variant={"secondary"} ><Plus size={24}/> Добавить</Button>
    </div>
  );
}
