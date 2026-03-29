// import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
// import useDataFetch from "@/pages/filial/table/queries";
import {   Plus } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setId] = useQueryState("id");
  return (
    <div className="  px-[20px] h-[64px]   flex gap-2 mb-2  ">
      <SearchInput className="w-full max-w-[300px]  mr-4"/>
   
      <Button onClick={() => setId("new")}  className="h-full ml-auto  w-[200px]  "  variant={"secondary"} ><Plus size={24}/> Добавить</Button>
    </div>
  );
}
