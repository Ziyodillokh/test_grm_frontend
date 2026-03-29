import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import {   Plus } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setId] = useQueryState("id");
  return (
    <div className=" px-[20px] h-[64px]   flex gap-2 mb-2  ">
      <SearchInput className="mr-auto max-w-[300px] w-full" />
  
      <Button onClick={() => setId("new")}  className="h-full   w-[200px]   border-y-0   "  variant={"secondary"} ><Plus size={24}/> Добавить</Button>
    </div>
  );
}
