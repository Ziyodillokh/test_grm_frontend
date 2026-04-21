import { useCallback, useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUsersByRole, useUploadAndCreate } from "../queries";

const ROLE_OPTIONS = [
  { value: "4", label: "F-manager" },
  { value: "9", label: "M-manager" },
  { value: "10", label: "Bugalter" },
  { value: "12", label: "Rahbar" },
];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const { data: usersData, isLoading: usersLoading } = useUsersByRole(
    role ? Number(role) : undefined
  );
  const users = usersData?.items ?? [];

  const uploadAndCreate = useUploadAndCreate();
  const isSubmitting = uploadAndCreate.isPending;

  useEffect(() => { setUserId(""); }, [role]);
  useEffect(() => { if (!isOpen) { setSelectedFile(null); setRole(""); setUserId(""); } }, [isOpen]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "video/mp4" || file.type === "video/quicktime") setSelectedFile(file);
      else toast.error("Faqat .mp4 va .mov formatdagi videolar qabul qilinadi");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) { toast.error("Video hajmi 100MB dan oshmasligi kerak"); return; }
      setSelectedFile(file);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !role) return;
    try {
      await uploadAndCreate.mutateAsync({
        file: selectedFile,
        targetRole: Number(role),
        targetUserId: userId && userId !== "all" ? userId : undefined,
        title: selectedFile.name,
      });
      onClose();
    } catch {
      // error toast already handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 border-b-0 bg-transparent flex flex-col items-start">
          <DialogTitle className="text-xl font-bold text-[#1A1A1A]">Video Murojaat Yuklash</DialogTitle>
          <DialogDescription className="text-sm text-[#999] mt-1">
            Davomiyligi 20 sekund va hajmi 100mb dan oshmasligi, hamda .mov, .mp4 formatda bo'lishi kerak
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${dragActive ? "border-[#0078D4] bg-[#0078D4]/5" : "border-gray-200 bg-[#F0F7FF]"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0078D4]/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#0078D4]" />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{selectedFile.name}</p>
                  <p className="text-xs text-[#999] mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 mt-1 hover:underline">O'chirish</button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-[#1A1A1A]">Videoni yuklang</p>
                  <label className="text-sm text-[#0078D4] cursor-pointer hover:underline">
                    Bunga bosib yuklasangiz ham bo'ladi
                    <input type="file" accept=".mp4,.mov,video/mp4,video/quicktime" onChange={handleFileSelect} className="hidden" />
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Lavozim</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full h-10 rounded-sm"><SelectValue placeholder="Lavozimni tanlang" /></SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Foydalanuvchi (ixtiyoriy)</label>
            <Select value={userId} onValueChange={setUserId} disabled={!role}>
              <SelectTrigger className="w-full h-10 rounded-sm">
                <SelectValue placeholder={usersLoading ? "Yuklanmoqda..." : !role ? "Avval lavozimni tanlang" : "Barchasi (tanlash shart emas)"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                {users.map((u: any) => (<SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName || ""}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedFile || !role || isSubmitting}
            className="w-full h-11 rounded-sm bg-[#0078D4] text-white font-medium text-sm hover:bg-[#006CBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Yuklanmoqda...</>) : "+ Yuborish"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
