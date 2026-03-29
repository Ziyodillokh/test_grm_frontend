import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
import {   Plus } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setId] = useQueryState("id");
  return (
    <div className="bg-sidebar border-border border-b  px-[20px] h-[64px]   flex   ">
      <SearchInput className="w-full max-w-[300px] border border-y-0 border-l-0 border-r mr-4"/>
      <Button onClick={() => setId("new")}  className="h-full ml-auto    border-y-0   "  variant={"outline"} ><Plus size={24}/> Добавить</Button>
    </div>
  );
}
