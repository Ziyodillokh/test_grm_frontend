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
import type { TransactionItem } from "../type";
import type { CashflowType } from "@/components/adding-parish-flow";

interface Props {
  editId: string | null;
  onClose: () => void;
  item: TransactionItem | undefined;
}

export default function UpdateCashflowDialog({ editId, onClose, item }: Props) {
  const queryClient = useQueryClient();
  const isOrder = item?.tip === "order";
  const isOpen = !!editId && !!item;

  const [price, setPrice] = useState("");
  const [plasticSum, setPlasticSum] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Fetch cashflow types for regular cashflows
  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager", "update-dialog"],
    queryFn: () => getAllData("/cashflow-types/for/branch-manager"),
    enabled: isOpen && !isOrder,
  });

  const categories = (cashflowTypesData as unknown as CashflowType[])?.filter(
    (ct) =>
      (ct.type ===
        (item?.type === "Приход" ? "income" : "out") ||
        ct.type === "both") &&
      ct.slug !== "balance"
  );

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      if (isOrder) {
        setPrice(String(item.order?.price || 0));
        setPlasticSum(String(item.order?.plasticSum || 0));
      } else {
        setPrice(String(item.price || 0));
      }
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
      queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] });
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

    if (isOrder) {
      payload.price = priceNum;
      payload.plasticSum = parseFloat(plasticSum) || 0;
    } else {
      payload.price = priceNum;
      if (selectedType && selectedType !== item?.cashflow_type?.id) {
        payload.cashflow_type = selectedType;
      }
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

        {isOrder ? (
          /* Order cashflow: price + plasticSum + comment + date */
          <div className="p-2 space-y-1">
            <div className="flex pl-2 items-center bg-input rounded-sm h-[70px]">
              <div className="text-[12px] text-muted-foreground min-w-[80px] pl-2">
                Naqd
              </div>
              <Input
                placeholder="0.00"
                value={price}
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-none h-[70px] placeholder:text-[28px] !text-[28px] font-semibold rounded-sm bg-transparent px-0"
              />
              <div className="text-3xl text-[#5D5D53] mx-4">$</div>
            </div>
            <div className="flex pl-2 items-center bg-input rounded-sm h-[70px]">
              <div className="text-[12px] text-muted-foreground min-w-[80px] pl-2">
                Terminal
              </div>
              <Input
                placeholder="0.00"
                value={plasticSum}
                type="number"
                min={0}
                onChange={(e) => setPlasticSum(e.target.value)}
                className="w-full border-none h-[70px] placeholder:text-[28px] !text-[28px] font-semibold rounded-sm bg-transparent px-0"
              />
              <div className="text-3xl text-[#5D5D53] mx-4">$</div>
            </div>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-none h-[50px] text-[14px] bg-input font-semibold rounded-sm px-3"
            />
            <Textarea
              placeholder="Izoh"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-none focus:border-none outline-none shadow-none h-[70px] text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5"
            />
          </div>
        ) : (
          /* Regular cashflow: categories + price + comment + date */
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
        )}

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
