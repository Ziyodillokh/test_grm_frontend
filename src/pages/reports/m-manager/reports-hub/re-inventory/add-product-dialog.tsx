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
import useDebounce from "@/hooks/useDebounce";
import { apiRoutes } from "@/service/apiRoutes";

import { useQrBaseByCode, useProcessInventory } from "./queries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filialId: string;
}

export default function AddProductDialog({ open, onOpenChange, filialId }: Props) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [value, setValue] = useState<string>("");
  const debouncedCode = useDebounce(code, 400);

  const { data: qrBase, isFetching: qrLoading } = useQrBaseByCode({
    code: debouncedCode,
    enabled: !!debouncedCode,
  });

  const { mutate: process, isPending } = useProcessInventory();

  useEffect(() => {
    if (!open) {
      setCode("");
      setValue("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!qrBase?.id) {
      toast.error("Shtrix kod topilmadi");
      return;
    }
    const numValue = Number(value);
    if (!numValue || numValue <= 0) {
      toast.error("Qiymat to'g'ri emas");
      return;
    }

    process(
      {
        code: qrBase.code,
        isMetric: qrBase.isMetric,
        value: numValue,
        filialId,
        countryId: qrBase.country?.id,
        collectionId: qrBase.collection?.id,
        sizeId: qrBase.size?.id,
        shapeId: qrBase.shape?.id,
        styleId: qrBase.style?.id,
        colorId: qrBase.color?.id,
        modelId: qrBase.model?.id,
        factoryId: qrBase.factory?.id,
      },
      {
        onSuccess: () => {
          toast.success("Mahsulot qo'shildi");
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReport] });
          queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReportTotals] });
          setCode("");
          setValue("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Mahsulot qo'shish</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-[12px] mt-[8px]">
          <div>
            <label className="text-[13px] text-[#A3A3A3] mb-[4px] block">Shtrix kod</label>
            <Input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Shtrix kodni kiriting..."
            />
          </div>

          {qrLoading && (
            <div className="flex items-center gap-2 text-[13px] text-[#a3a3a3]">
              <Loader className="w-4 h-4 animate-spin" /> Qidirilmoqda...
            </div>
          )}

          {debouncedCode && !qrLoading && !qrBase?.id && (
            <div className="text-[13px] text-[#EF5C12]">Shtrix kod topilmadi</div>
          )}

          {qrBase?.id && (
            <div className="bg-[#f5f7f9] rounded-sm p-[10px] flex flex-col gap-[4px]">
              <div className="text-[13px] font-medium text-[#1a1a1a]">
                {qrBase.collection?.title || "—"}
              </div>
              <div className="text-[12px] text-[#a3a3a3]">
                {[qrBase.model?.title, qrBase.size?.title, qrBase.color?.title].filter(Boolean).join(" / ")}
              </div>
              <div className="text-[11px] text-[#a3a3a3]">
                {qrBase.isMetric ? "Metr (uzunlik)" : "Dona (soni)"}
              </div>
            </div>
          )}

          <div>
            <label className="text-[13px] text-[#A3A3A3] mb-[4px] block">
              {qrBase?.isMetric ? "Uzunlik (sm)" : "Soni"}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={qrBase?.isMetric ? "Masalan: 250" : "Masalan: 3"}
            />
          </div>
        </div>

        <DialogFooter className="mt-[12px] gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !qrBase?.id}>
            {isPending ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            Qo'shish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
