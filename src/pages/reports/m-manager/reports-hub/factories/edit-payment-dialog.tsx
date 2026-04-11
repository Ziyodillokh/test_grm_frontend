import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import type { FactoryDetailItem } from "./type";

interface Props {
  editId: string | null;
  onClose: () => void;
  item: FactoryDetailItem | undefined;
  factoryQueryKey: unknown[];
}

export default function EditPaymentDialog({
  editId,
  onClose,
  item,
  factoryQueryKey,
}: Props) {
  const queryClient = useQueryClient();
  const isOpen = !!editId && !!item;

  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (item) {
      setPrice(String(item.total_cost || 0));
      setComment(item.comment || "");
      setDate(item.date ? item.date.slice(0, 16) : "");
    }
  }, [item, editId]);

  const { mutate: updateCashflow, isPending } = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      UpdatePatchData(apiRoutes.cashflow + "/" + editId, "update", data),
    onSuccess: () => {
      toast.success("Muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({ queryKey: factoryQueryKey });
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

    if (comment !== (item?.comment || "")) {
      payload.comment = comment;
    }
    if (date && date !== (item?.date || "").slice(0, 16)) {
      payload.date = date;
    }

    updateCashflow(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="costomModal min-w-[420px] p-1 gap-0 rounded-[10px]">
        <div className="p-1 h-[30px] pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[35px] bg-[#89A143] text-white">
          Tahrirlash
        </div>

        <div className="p-2 space-y-1">
          <div className="flex pl-2 items-center bg-input rounded-[7px] h-[70px]">
            <div className="text-[12px] text-muted-foreground min-w-[60px] pl-2">
              Summa
            </div>
            <Input
              placeholder="0.00"
              value={price}
              type="number"
              min={0}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border-none h-[70px] placeholder:text-[28px] !text-[28px] font-semibold rounded-[7px] bg-transparent px-0"
            />
            <div className="text-3xl text-[#5D5D53] mx-4">$</div>
          </div>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-none h-[50px] text-[14px] bg-input font-semibold rounded-[7px] px-3"
          />
          <Textarea
            placeholder="Izoh"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-none focus:border-none outline-none shadow-none h-[70px] text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending || !price}
          className="p-5 rounded-[7px] mt-1 bg-[#89A143] text-white"
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
