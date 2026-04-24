import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/service/apiRoutes";

import { useUpdateReInventoryCheckCount } from "./queries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reInventoryId: string;
  currentValue: number;
  title?: string;
  isMetric?: boolean;
}

export default function EditProductDialog({
  open,
  onOpenChange,
  reInventoryId,
  currentValue,
  title,
  isMetric,
}: Props) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>(String(currentValue ?? ""));
  const { mutate: update, isPending } = useUpdateReInventoryCheckCount();

  useEffect(() => {
    if (open) setValue(String(currentValue ?? ""));
  }, [open, currentValue]);

  const handleSubmit = () => {
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue < 0) {
      toast.error("Qiymat to'g'ri emas");
      return;
    }

    update(
      { id: reInventoryId, check_count: numValue },
      {
        onSuccess: () => {
          toast.success("O'zgartirildi");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReport] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReportTotals] });
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Tekshirilgan miqdorni tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-[10px] mt-[8px]">
          {title && (
            <div className="text-[13px] text-[#1a1a1a] font-medium">{title}</div>
          )}
          <div>
            <label className="text-[13px] text-[#A3A3A3] mb-[4px] block">
              {isMetric ? "Tekshirilgan uzunlik (sm)" : "Tekshirilgan soni"}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="mt-[12px] gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
