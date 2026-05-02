import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import formatPrice from "@/utils/formatPrice";

import { TReportData } from "../type";

const SORT_OPTIONS = [
  { value: "default", label: "Mahsulot kesimida" },
  { value: "collection", label: "Kolleksiya kesimida" },
];

interface Props {
  partiyaStatus: string | undefined;
  check: boolean | undefined;
  totals?: TReportData;
  onAdd?: () => void;
}

const DEFAULT_TIP_FOR_W = "recount";
const DEFAULT_TIP_FOR_M = "new";

export default function Filters({ partiyaStatus = "new", check, totals, onAdd }: Props) {
  const { id } = useParams();
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();

  const role = meUser?.position?.role;
  const isMManager = role === 9;
  const isWManager = role === 7 || role === 4;

  const defaultTip = isWManager ? DEFAULT_TIP_FOR_W : DEFAULT_TIP_FOR_M;
  const [tip, setTip] = useQueryState("tip", parseAsString.withDefault(defaultTip));
  const [type, setType] = useQueryState("type", parseAsString.withDefault("default"));

  // Tab tartibi rolga qarab
  const tabs = isWManager
    ? [
        { value: "recount", label: "Qabul" },
        { value: "new", label: "Ro'yxat" },
        { value: "surplus", label: "Ortiqcha" },
        { value: "deficit", label: "Kamomad" },
      ]
    : [
        { value: "new", label: "Ro'yxat" },
        { value: "recount", label: "Qabul" },
        { value: "surplus", label: "Ortiqcha" },
        { value: "deficit", label: "Kamomad" },
      ];

  // +Qo'shish faqat: M-manager → Ro'yxat (new); W-manager → Qabul (переучет)
  const showAdd =
    (isMManager && tip === "new") || (isWManager && tip === "recount");

  // Status change button (mavjud logika saqlandi)
  const changeStatus = useMemo(() => {
    if (partiyaStatus === "new" && isMManager) return "pending";
    if (partiyaStatus === "pending" && isWManager) return "closed";
    if (partiyaStatus === "closed" && isMManager) return "finished";
    return undefined;
  }, [partiyaStatus, isMManager, isWManager]);

  const StatusText: Record<string, string> = {
    new: "Qabulga yuborish",
    pending: "Qabul jarayonida",
    close: "Partiyani yopish",
    closed: "Yopilgan",
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      UpdatePatchData(apiRoutes.partiesChanngeStatus, id + "/" + changeStatus, {}),
    onSuccess: () => {
      toast.success("Holat yangilandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.parties] });
    },
  });

  // Status button — toolbarning o'ng tomonida, Umumiyning yonida
  const statusButton = isWManager ? (
    <Button
      onClick={() => mutate()}
      disabled={check || isPending}
      variant={check ? "outline" : "default"}
      className="h-[42px] rounded-sm"
    >
      {isPending ? <Loader className="animate-spin mr-1" size={16} /> : null}
      {check ? "Yuborildi" : "Qabul tasdiqlash"}
    </Button>
  ) : (
    <Button
      onClick={() => mutate()}
      disabled={!changeStatus || isPending}
      variant={partiyaStatus === "new" || partiyaStatus === "closed" ? "default" : "outline"}
      className="h-[42px] rounded-sm"
    >
      {isPending ? <Loader className="animate-spin mr-1" size={16} /> : null}
      {StatusText[(check && partiyaStatus === "pending") ? "closed" : check ? "close" : (partiyaStatus || "new")]}
    </Button>
  );

  const totalsLine = totals ? (
    <div className="flex items-center bg-white rounded-sm px-[16px] h-[42px] gap-[8px]">
      <span className="text-[13px] text-[#A3A3A3]">Umumiy:</span>
      <span className="text-[14px] font-medium text-[#1A1A1A]">
        {formatPrice(Number(totals.count || 0))} ta
      </span>
      <span className="text-[14px] font-medium text-[#1A1A1A]">
        {formatPrice(Number(totals.volume || 0))} m²
      </span>
      <span className="text-[14px] font-medium text-[#1A1A1A]">
        {formatPrice(Number(totals.total || 0))} $
      </span>
    </div>
  ) : null;

  return (
    <div className="px-[20px]">
      {/* Toolbar — search, sort, excel + status + Umumiy */}
      <ReportToolbar
        actions={
          <>
            {statusButton}
            {totalsLine}
          </>
        }
        sortContent={
          <div className="flex flex-col gap-[0px]">
            {SORT_OPTIONS.map((opt) => {
              const active = type === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`relative h-[50px] rounded-[8px] flex items-center px-[32px] text-[15px] font-medium text-[#1a1a1a] text-left transition ${
                    active ? "bg-white" : "hover:bg-white/60"
                  }`}
                >
                  {active && (
                    <span className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[4px] h-[24px] rounded-[8px] bg-[#0078d4]" />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        }
      />

      {/* Tabs row: tabs (left) — +Qo'shish (right) */}
      <div className="flex items-center gap-[8px] mb-[12px]">
        <div className="flex items-center bg-white rounded-sm p-[4px] gap-[2px]">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTip(t.value)}
              className={`px-[16px] h-[34px] rounded-sm text-[13px] font-medium transition-colors ${
                tip === t.value
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A] hover:bg-[#f5f7f9]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {showAdd && (
          <Button
            onClick={onAdd}
            className="h-[42px] rounded-sm bg-[#1A1A1A] hover:bg-[#333] text-white px-5 text-[14px] ml-auto"
          >
            <Plus size={16} className="mr-1" /> Qo'shish
          </Button>
        )}
      </div>
    </div>
  );
}
