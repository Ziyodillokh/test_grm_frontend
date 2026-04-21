import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UpdatePatchData, getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import type { TData } from "./type";
import type { CashflowType } from "@/components/adding-parish-flow";

interface Props {
  editId: string | null;
  onClose: () => void;
  item: TData | undefined;
}

export default function UpdateCashflowDialog({ editId, onClose, item }: Props) {
  const queryClient = useQueryClient();
  const isOpen = !!editId && !!item;

  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/by/managers", "update-dialog", item?.type],
    queryFn: () =>
      getAllData<CashflowType[], object>(
        "/cashflow-types/by/managers/both",
        { type: item?.type === "Приход" ? "in" : "out" }
      ),
    enabled: isOpen,
  });

  const categories = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) =>
      ct.is_visible &&
      !["balance", "dealer", "kassa", "online"].includes(ct.slug)
  );

  useEffect(() => {
    if (item) {
      setPrice(String(item.price || 0));
      setComment(item.comment || "");
      setDate(item.date ? item.date.slice(0, 16) : "");
      setSelectedType(item.cashflow_type?.id || "");
    }
  }, [item, editId]);

  const { mutate: updateCashflow, isPending } = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      UpdatePatchData(apiRoutes.cashflow + "/" + editId, "update", data),
    onSuccess: () => {
      toast.success("Muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: ["kassa-reports"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleSubmit = () => {
    const priceNum = parseFloat(price);
    if (!priceNum || priceNum <= 0) {
      toast.error("Summani kiriting");
      return;
    }

    const payload: Record<string, unknown> = {};
    payload.price = priceNum;

    if (selectedType && selectedType !== item?.cashflow_type?.id) {
      payload.cashflow_type = selectedType;
    }
    if (comment !== (item?.comment || "")) {
      payload.comment = comment;
    }
    if (date && date !== (item?.date || "").slice(0, 16)) {
      payload.date = date;
    }

    updateCashflow(payload);
  };

  const isIncome = item?.type === "Приход";
  const headerColor = isIncome ? "bg-[#89A143]" : "bg-[#E38157]";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-sm">
        <div
          className={`p-1 h-[30px] pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[35px] ${headerColor} text-white`}
        >
          Tahrirlash
        </div>

        <div className="flex gap-1">
          <div className="flex w-full max-w-[210px] items-start justify-start flex-wrap gap-1">
            {categories?.map((ct) => (
              <div
                key={ct.id}
                onClick={() => setSelectedType(ct.id)}
                className={`w-[calc(50%-2px)] h-22 bg-input flex items-center justify-center flex-col rounded-sm text-center cursor-pointer ${
                  selectedType === ct.id
                    ? isIncome
                      ? "ring-2 ring-[#89A143]"
                      : "ring-2 ring-[#E38157]"
                    : ""
                }`}
              >
                <p className="text-primary text-[13px] font-medium mt-2.5">
                  {ct.title}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full">
            <div className="flex pl-2 items-center bg-input rounded-sm h-[90px]">
              <Input
                placeholder="0.00"
                value={price}
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-sm bg-transparent px-0"
              />
              <div className="text-4xl text-[#5D5D53] mx-4">$</div>
            </div>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-none h-[50px] mt-0.5 text-[14px] bg-input font-semibold rounded-sm px-3"
            />
            <Textarea
              placeholder="Izoh"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-none focus:border-none outline-none shadow-none mt-0.5 h-[70px] text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending || !price}
          className={`p-5 rounded-sm mt-1 ${headerColor} text-white`}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Saqlanmoqda...
            </span>
          ) : (
            "Saqlash"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
