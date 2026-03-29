// import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";
// import useDataFetch from "@/pages/filial/table/queries";
import {   Plus } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setId] = useQueryState("id");

  // const { data} =
  //   useDataFetch({
  //     queries: {
  //       page:2,
  //       limit:50,
  //       // type: "filial",
  //     },
  //   });
  // const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // const { meUser } = useMeStore();
  return (
    <div className="  px-[20px] h-[64px]   flex  gap-2 mb-2 ">
      <SearchInput className="w-full max-w-[300px] mr-4"/>
     {/* <FilterSelect
        icons={<Store />}
        className="w-full max-w-[170px]"
        placeholder="Филиалы"
        name="filial"
        options={[{label:"Все",value:"all"} ,...flatData?.map(e=>({label:e.name,value:e.id}))]}
      /> */}
      <Button onClick={() => setId("new")}  className="h-full ml-auto w-[180px]  "  variant={"secondary"} ><Plus size={24}/> Добавить</Button>
    </div>
  );
}
