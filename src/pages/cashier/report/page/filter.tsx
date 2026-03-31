import { FileOutput, Loader } from "lucide-react";

import FilterSelect from "@/components/filters-ui/filter-select";
import { Button } from "@/components/ui/button";
import qs from "qs";
import { parseAsString, useQueryState } from "nuqs";
import { apiRoutes } from "@/service/apiRoutes";
import { useMutation } from "@tanstack/react-query";

const CashflowStatus = [
  {
    label: "Barchasi",
    value: "all",
  },
  {
    label: "Kutilmoqda",
    value: "pending",
  },
  {
    label: "Tasdiqlangan",
    value: "accepted",
  },
  {
    label: "Rad etilgan",
    value: "rejected",
  },
];

const SortSingle = [
  {
    label: "Все",
    value: "Все",
  },
  {
    label: "Расход",
    value: "Расход",
  },
  {
    label: "Приход",
    value: "Приход",
  },
];

export default function Filters({
  kassaId,
}: {
  kassaId: string | undefined;
}) {
  const [id] = useQueryState("id");
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));

  const { mutate: exelMudate, isPending: exelPending } = useMutation({
    mutationFn: async () => {
      const query = {
        kassaId: kassaId || id || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";

      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });

  return (
    <div className="w-full mb-2 sticky top-0 flex gap-3 h-[50px]">
      <FilterSelect
        options={CashflowStatus}
        className="max-w-[426px] rounded-xl bg-primary text-[#E6E6D9] w-full text-[20px]"
        classNameValue="bg-red-200"
        placeholder="Barchasi"
        classNameContainer="bg-primary text-[#E6E6D9]"
        classNameItem="bg-primary p-4 text-[20px]"
        defaultValue="all"
        name="sort"
      />

      {(sort === "all" || Boolean(id)) && (
        <FilterSelect
          options={SortSingle}
          className="max-w-[300px] rounded-xl bg-primary text-[#E6E6D9] w-full text-[20px]"
          classNameValue="bg-red-200"
          placeholder="Все операции"
          classNameContainer="bg-primary text-[#E6E6D9]"
          classNameItem="bg-primary p-4 text-[20px]"
          defaultValue="Все"
          name="sortSingle"
        />
      )}

      <Button
        onClick={() => exelMudate()}
        disabled={exelPending}
        className="h-full ml-auto bg-card hover:bg-card rounded-xl text-primary justify-center gap-1 px-4 border-0"
        variant={"outline"}
      >
        {exelPending ? <Loader className="animate-spin" /> : <FileOutput />}
        Экспорт
      </Button>
    </div>
  );
}
