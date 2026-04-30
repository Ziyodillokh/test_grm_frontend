import { ListRow } from "@/components/ui/list-row";
import { Loader, Trash2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";

import PriceFilter from "../table/filter";
import useDiscountDataFetch from "./queries";
import ActionPage from "../discount-form";

const gridTemplate = "1fr 100px 60px 60px";
const columnLabels = ["Nomi", "Chegirma", "", ""];

export default function DiscountTablePage() {
  const [search] = useQueryState("search", parseAsString);
  const [, setId] = useQueryState("id", parseAsString);
  const queryClient = useQueryClient();

  const { data, isLoading } = useDiscountDataFetch({
    queries: {
      limit: 100,
      page: 1,
      search: search || undefined,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];

  const { mutate: deleteDiscount } = useMutation({
    mutationFn: (id: string) => api.delete(`${apiRoutes.discount}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiRoutes.discount] }),
  });

  return (
    <div className="flex flex-col h-full">
      <PriceFilter>
        <button
          onClick={() => setId("new")}
          className="ml-auto h-[42px] px-[16px] rounded-sm bg-[#0078D4] text-white text-[13px] font-medium hover:bg-[#006CBE] transition-colors shrink-0"
        >
          + Qo'shish
        </button>
      </PriceFilter>

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[20px]"
              minHeight={60}
            >
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.title}</span>
              <span className="text-[13px] text-[#FF6527] font-medium">-{item.discountPercentage}%</span>
              <button
                onClick={() => setId(item.id)}
                className="h-[32px] px-[10px] rounded-sm text-[12px] bg-[#f5f7f9] text-[#1a1a1a]"
              >
                Tahrir
              </button>
              <button
                onClick={() => deleteDiscount(item.id)}
                className="h-[32px] w-[32px] rounded-sm flex items-center justify-center bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]"
              >
                <Trash2 className="w-[14px] h-[14px]" />
              </button>
            </ListRow>
          ))
        )}
      </div>

      <ActionPage />
    </div>
  );
}
