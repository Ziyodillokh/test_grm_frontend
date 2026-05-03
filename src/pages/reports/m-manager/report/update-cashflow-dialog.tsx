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
import { useMeStore } from "@/store/me-store";
import type { TData } from "./type";
import type { CashflowType } from "@/components/adding-parish-flow";

interface Props {
  editId: string | null;
  onClose: () => void;
  item: TData | undefined;
}

export default function UpdateCashflowDialog({ editId, onClose, item }: Props) {
  const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  // Role-based cashflow_type endpoint:
  // 4 (F-manager) → /for/f-manager
  // 6 (cashier) → /for/cashier (= F-manager filterli)
  // 9 (M-manager), 10 (Accountant) → /by/managers/both (M-manager + Accountant kategoriyalari)
  // Boshqa role'lar → /by/managers/<userId> (o'z position'iga ko'ra)
  const cashflowTypesEndpoint =
    role === 4 ? "/cashflow-types/for/f-manager" :
    role === 6 ? "/cashflow-types/for/cashier" :
    (role === 9 || role === 10) ? "/cashflow-types/by/managers/both" :
    `/cashflow-types/by/managers/${meUser?.id || "both"}`;
  const isOpen = !!editId && !!item;

  const [price, setPrice] = useState("");
  const [plastic, setPlastic] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const isOrder = item?.tip === "order";

  const { data: cashflowTypesData } = useQuery({
    queryKey: [cashflowTypesEndpoint, "update-dialog", item?.type, role],
    queryFn: () =>
      getAllData<CashflowType[], object>(
        cashflowTypesEndpoint,
        { type: item?.type === "income" ? "in" : "out" }
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
      // Order uchun price = order.price (naqd qism), plastic = order.plastic (terminal qism)
      // Manual cashflow uchun price = cashflow.price
      if (item.tip === "order") {
        setPrice(String((item as any).order?.price || 0));
        setPlastic(String((item as any).order?.plastic ?? (item as any).order?.plasticSum ?? 0));
      } else {
        setPrice(String(item.price || 0));
        setPlastic("0");
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
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: ["kassa-reports"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleSubmit = () => {
    const priceNum = parseFloat(price) || 0;
    const plasticNum = isOrder ? (parseFloat(plastic) || 0) : 0;
    if (priceNum + plasticNum <= 0) {
      toast.error("Summani kiriting (price yoki plastic)");
      return;
    }

    const payload: Record<string, unknown> = {};
    payload.price = priceNum;
    if (isOrder) {
      payload.plasticSum = plasticNum;
    }

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

  const isIncome = item?.type === "income";
  const headerColor = isIncome ? "bg-[#89A143]" : "bg-[#E38157]";
  const headerLabel = isOrder ? "Order tahrirlash" : "Tahrirlash";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-sm">
        <div
          className={`p-1 h-[30px] pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[35px] ${headerColor} text-white`}
        >
          {headerLabel}
        </div>

        <div className="flex gap-1">
          {/* Kategoriyalar — faqat manual cashflow uchun */}
          {!isOrder && (
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
          )}

          <div className="w-full">
            {/* Naqd (order.price — naqd qism) */}
            {isOrder && (
              <p className="text-[11px] text-[#5D5D53] px-1 mb-0.5">Naqd (order.price)</p>
            )}
            <div className="flex pl-2 items-center bg-input rounded-sm h-[90px]">
              <Input
                placeholder="0.00"
                value={price}
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-sm bg-transparent px-0"
              />
              <div className="text-[16px] text-[#5D5D53] mr-4 whitespace-nowrap">$ {isOrder ? "Naqd" : ""}</div>
            </div>

            {/* Plastic / Terminal (faqat order uchun) */}
            {isOrder && (
              <>
                <p className="text-[11px] text-[#0078D4] px-1 mt-1 mb-0.5">Terminal (order.plastic)</p>
                <div className="flex pl-2 items-center bg-input rounded-sm h-[60px]">
                  <Input
                    placeholder="0.00"
                    value={plastic}
                    type="number"
                    min={0}
                    onChange={(e) => setPlastic(e.target.value)}
                    className="w-full border-none h-[60px] placeholder:text-[20px] !text-[20px] font-semibold rounded-sm bg-transparent px-0 text-[#0078D4]"
                  />
                  <div className="text-[14px] text-[#0078D4] mr-4 whitespace-nowrap">$ Terminal</div>
                </div>
                {/* Jami (preview) */}
                <p className="text-[11px] text-[#1a1a1a] px-1 mt-1">
                  Jami: <b>${(parseFloat(price) || 0) + (parseFloat(plastic) || 0)}</b>
                </p>
              </>
            )}

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
          disabled={isPending}
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
