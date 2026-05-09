import { useNavigate, useParams, useLocation } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListRow } from "@/components/ui/list-row";
import { TabsPill } from "@/components/ui/tabs-pill";
import { Button } from "@/components/ui/button";
import { OutlineButton } from "@/components/ui/outline-button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import formatPrice from "@/utils/formatPrice";
import { AddData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { useDebtClients } from "./queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import ReportToolbar from "@/components/report-toolbar";

const gridTemplate = "40px 1fr 140px 120px 120px 120px 40px";
const columnLabels = ["№", "Ism", "Telefon", "Olgan", "Qaytargan", "Qoldiq", ""];

interface DebtClient {
  id: string;
  fullName: string;
  phone?: string;
  address?: string;
  owed?: number;
  given?: number;
  balance?: number;
  seller?: { firstName?: string; lastName?: string; phone?: string } | null;
}

export default function ClientDebtClients() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const push = useBreadcrumbStore((s) => s.push);
  const { filialId } = useParams();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("mijoz"),
  );
  const [search] = useQueryState("search", parseAsString);

  const activeType = (tab === "qarzdor" ? "qarzdor" : "mijoz") as
    | "mijoz"
    | "qarzdor";

  const { data, isLoading } = useDebtClients(filialId, activeType);

  const basePath = location.pathname.includes("/f-manager/")
    ? "/f-manager/reports-hub/client-debt"
    : "/m-manager/reports-hub/client-debt";

  const allItems: DebtClient[] = data?.items || [];
  const items = search
    ? allItems.filter((item) =>
        (item.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.phone || "").includes(search)
      )
    : allItems;
  const summary = data?.summary || { totalOwed: 0, totalGiven: 0, balance: 0 };

  // Edit dialog
  const [editClient, setEditClient] = useState<DebtClient | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const openEdit = (c: DebtClient) => {
    setEditClient(c);
    setEditName(c.fullName || "");
    setEditPhone(c.phone || "");
    setEditAddress(c.address || "");
  };

  const closeEdit = () => {
    setEditClient(null);
    setEditName("");
    setEditPhone("");
    setEditAddress("");
  };

  const { mutate: updateClient, isPending: updating } = useMutation({
    mutationFn: (payload: { id: string; fullName: string; phone: string; address: string }) =>
      UpdatePatchData(apiRoutes.clients, payload.id, {
        fullName: payload.fullName,
        phone: payload.phone,
        address: payload.address,
      }),
    onSuccess: () => {
      toast.success("Yangilandi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clientDebtReportClients] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clients] });
      closeEdit();
    },
  });

  const handleSaveEdit = () => {
    if (!editClient) return;
    if (!editName.trim()) { toast.error("Ismni kiriting"); return; }
    if (!editPhone.trim()) { toast.error("Telefon raqamni kiriting"); return; }
    if (!editAddress.trim()) { toast.error("Manzilni kiriting"); return; }
    updateClient({ id: editClient.id, fullName: editName.trim(), phone: editPhone.trim(), address: editAddress.trim() });
  };

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAddress, setAddAddress] = useState("");

  const closeAdd = () => {
    setAddOpen(false);
    setAddName("");
    setAddPhone("");
    setAddAddress("");
  };

  const { mutate: createClient, isPending: creating } = useMutation({
    mutationFn: (payload: { fullName: string; phone: string; address: string; isDebtor: boolean; filialId: string; userId: string }) =>
      AddData(apiRoutes.clients, payload),
    onSuccess: () => {
      toast.success(activeType === "qarzdor" ? "Qarzdor qo'shildi" : "Mijoz qo'shildi");
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clientDebtReportClients] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clients] });
      closeAdd();
    },
  });

  const handleSaveAdd = () => {
    if (!addName.trim()) { toast.error("Ismni kiriting"); return; }
    if (!addPhone.trim()) { toast.error("Telefon raqamni kiriting"); return; }
    if (!addAddress.trim()) { toast.error("Manzilni kiriting"); return; }
    if (!filialId || !meUser?.id) { toast.error("Filial yoki user topilmadi"); return; }
    createClient({
      fullName: addName.trim(),
      phone: addPhone.trim(),
      address: addAddress.trim(),
      isDebtor: activeType === "qarzdor",
      filialId,
      userId: meUser.id,
    });
  };

  const addLabel = activeType === "qarzdor" ? "Qarzdor qo'shish" : "Mijoz qo'shish";

  return (
    <div className="flex flex-col h-full gap-[20px]">
      <ReportToolbar
        totalsItems={[
          { label: "Umumiy:", value: summary.totalOwed || 0, color: "#1a1a1a" },
          { value: summary.totalGiven || 0, color: "#47B13C" },
          { value: summary.balance || 0, color: "#ef4444" },
        ]}
        actions={
          <OutlineButton onClick={() => setAddOpen(true)} icon={<Plus />}>
            {addLabel}
          </OutlineButton>
        }
      />

      {/* Tabs */}
      <div className="px-[12px]">
        <TabsPill
          tabs={[
            { value: "mijoz", label: "Mijozlar" },
            { value: "qarzdor", label: "Qarzdorlar" },
          ]}
          value={activeType}
          onChange={(v) => setTab(v)}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-[10px]">
        <div
          className="shrink-0 px-[12px]"
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
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-[13px] text-[#a3a3a3]">
              Ma'lumot topilmadi
            </div>
          ) : (
            items.map((item, i) => (
              <ListRow
                key={item.id || i}
                gridTemplate={gridTemplate}
                className="pl-[12px]"
                minHeight={60}
                onClick={() => {
                  const path = `${basePath}/${filialId}/${item.id}?tab=${activeType}`;
                  push(item.fullName || "Mijoz", path);
                  navigate(path);
                }}
              >
                <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
                <span className="text-[13px] font-medium text-[#1a1a1a]">{item.fullName}</span>
                <span className="text-[13px] text-[#a3a3a3]">{item.phone || "—"}</span>
                <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(item.owed || 0)} $</span>
                <span className="text-[13px] font-medium text-[#47B13C]">{formatPrice(item.given || 0)} $</span>
                <span className="text-[13px] font-medium text-[#ef4444]">{formatPrice(item.balance || 0)} $</span>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-[#f1f0e9]">
                        <MoreVertical className="w-[16px] h-[16px] text-[#A3A3A3]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(item)}>
                        Tahrirlash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </ListRow>
            ))
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && closeAdd()}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{addLabel}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              placeholder="To'liq ism"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <Input
              placeholder="+998901234567"
              value={addPhone}
              onChange={(e) => setAddPhone(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <Input
              placeholder="Manzil"
              value={addAddress}
              onChange={(e) => setAddAddress(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleSaveAdd}
                disabled={creating}
                className="flex-1 h-[44px] bg-[#47B13C] text-white"
              >
                {creating ? <Loader className="w-4 h-4 animate-spin" /> : "Saqlash"}
              </Button>
              <Button
                onClick={closeAdd}
                className="flex-1 h-[44px] bg-white text-[#1a1a1a] border border-[#e5e5e5]"
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editClient} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Mijozni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              placeholder="To'liq ism"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <Input
              placeholder="+998901234567"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <Input
              placeholder="Manzil"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="h-[44px] text-[14px]"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleSaveEdit}
                disabled={updating}
                className="flex-1 h-[44px] bg-[#47B13C] text-white"
              >
                {updating ? <Loader className="w-4 h-4 animate-spin" /> : "Saqlash"}
              </Button>
              <Button
                onClick={closeEdit}
                className="flex-1 h-[44px] bg-white text-[#1a1a1a] border border-[#e5e5e5]"
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
