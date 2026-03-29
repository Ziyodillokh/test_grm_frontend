import FilterSelect from "@/components/filters-ui/filter-select";
import SearchInput from "@/components/filters-ui/search-input";
import Statistics from "@/components/filters-ui/statistics";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { useMutation } from "@tanstack/react-query";
import { FileOutput, Loader } from "lucide-react";


export default function Filters() {
const {meUser} = useMeStore()

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      window.location.href = import.meta.env.VITE_BASE_URL+apiRoutes.excelProductExcelNew +  `?filialId=${meUser?.filial?.id}`
    },
  });

  return (
    <div className=" gap-2 mb-4 px-[20px] h-[64px] flex ">
      <SearchInput />
      {/* <FilterSelect 
        placeholder="Продукт"
        className=" w-[150px]"
        defaultValue="product"
        options={[
          { label: "Продукт", value: "product"},
          { label: "Коллекция", value: "collections" }
        ]}
        name="collection" 
      /> */}

      <FilterSelect 
        placeholder="Лист" 
        className="w-[150px]" 
        name="card"
        defaultValue="card"
        options={[
          { label: "Лист", value: "list"},
          { label: "Карточкы", value: "card" }
        ]}
      />
      <Statistics />
      <Button
      onClick={()=>exelMudate()}
      disabled={exelPending}
        className="h-full border-0 bg-card rounded-xl hover:bg-card w-[140px]  ml-auto"
        variant={"outline"}
      >
       {exelPending? <Loader className="animate-spin"/>:<FileOutput />}   Экспорт
      </Button>
    </div>
  );
}
