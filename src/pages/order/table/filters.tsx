import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";

import SearchInput from "@/components/filters-ui/search-input";
import { Button } from "@/components/ui/button";

export default function Filters() {
  const [, setId] = useQueryState("id");
  return (
    <div className="  px-[20px] h-[64px]   flex  mb-2 gap-2 ">
      <SearchInput className="mr-auto w-full max-w-[300px]" />
      <Button
        onClick={() => setId("new")}
        className="h-full w-[160px]    bg-card"
        variant={"secondary"}
      >
        <Plus size={24} /> Добавить
      </Button>
    </div>
  );
}
