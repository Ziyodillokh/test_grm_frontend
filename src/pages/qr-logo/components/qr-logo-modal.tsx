import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AddData } from "@/service/apiHelpers";

const qrLogoUrl = "/qr-logo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function QrLogoModal({ open, onClose }: Props) {
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { link: string; description?: string }) =>
      AddData(qrLogoUrl, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [qrLogoUrl] });
      toast.success("QR логотип создан");
      setLink("");
      setDescription("");
      onClose();
    },
    onError: () => {
      toast.error("Ошибка при создании");
    },
  });

  const handleSubmit = () => {
    if (!link.trim()) {
      toast.error("Введите ссылку");
      return;
    }
    mutate({ link: link.trim(), description: description.trim() || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Создать новый QR логотип</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 py-4">
          <div className="flex flex-col items-center gap-2 min-w-[140px]">
            <p className="text-[12px] text-muted-foreground">Генерация QR код</p>
            <div className="w-[120px] h-[120px] border rounded flex items-center justify-center bg-gray-50">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" y="5" width="25" height="25" rx="2" stroke="#ccc" strokeWidth="2" fill="none" />
                <rect x="50" y="5" width="25" height="25" rx="2" stroke="#ccc" strokeWidth="2" fill="none" />
                <rect x="5" y="50" width="25" height="25" rx="2" stroke="#ccc" strokeWidth="2" fill="none" />
                <rect x="10" y="10" width="15" height="15" rx="1" fill="#ddd" />
                <rect x="55" y="10" width="15" height="15" rx="1" fill="#ddd" />
                <rect x="10" y="55" width="15" height="15" rx="1" fill="#ddd" />
                <rect x="38" y="38" width="4" height="4" fill="#ddd" />
                <rect x="50" y="50" width="4" height="4" fill="#ddd" />
                <rect x="58" y="58" width="4" height="4" fill="#ddd" />
              </svg>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              QR код будет создан автоматически
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <div>
              <label className="text-[13px] font-medium mb-1 block">
                Ссылка страницы <span className="text-red-500">*</span>
              </label>
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://gilam-market.uz"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium mb-1 block">
                Описание
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Пишите сюда"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="!justify-start gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#89A143] hover:bg-[#7a9139] min-w-[140px]"
          >
            {isPending ? "Создание..." : "Сохранить"}
          </Button>
          <Button variant="outline" onClick={onClose} className="min-w-[140px]">
            Отменить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
