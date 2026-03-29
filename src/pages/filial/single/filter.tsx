import { FileOutput } from "lucide-react";

// import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";

export default function Filters() {
  return (
    <div className="  px-[20px] h-[64px]   bg-background  flex w-full  gap-2 mb-2  sticky top-0 z-50">
      <SearchInput  className="mr-auto"/>
      {/* <FilterSelect placeholder="Фильтр" name="news" /> */}
      <Button
        className="h-full   w-[140px]"
        variant={"secondary"}
      >
        <FileOutput /> Экспорт
      </Button>
    </div>
  );
}
