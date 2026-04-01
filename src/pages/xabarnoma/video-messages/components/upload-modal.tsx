import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
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

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.type === "video/mp4" ||
        file.type === "video/quicktime"
      ) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
      }
    },
    []
  );

  const handleSubmit = () => {
    if (!selectedFile || !role || !user) return;
    // TODO: implement actual upload logic
    onClose();
    setSelectedFile(null);
    setRole("");
    setUser("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 border-b-0 bg-transparent flex flex-col items-start">
          <DialogTitle className="text-xl font-bold text-[#1A1A1A]">
            Video Murojaat Yuklash
          </DialogTitle>
          <DialogDescription className="text-sm text-[#999] mt-1">
            Davomiyligi 20 sekund va hajmi 100mb dan oshmasligi, hamda .mov, .mp4
            formatda bo'lishi kerak
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? "border-[#0078D4] bg-[#0078D4]/5"
                : "border-gray-200 bg-[#F0F7FF]"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0078D4]/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#0078D4]" />
              </div>

              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#999] mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    Videoni yuklang
                  </p>
                  <label className="text-sm text-[#0078D4] cursor-pointer hover:underline">
                    Bunga bosib yuklasangiz ham bo'ladi
                    <input
                      type="file"
                      accept=".mp4,.mov,video/mp4,video/quicktime"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Role Select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Lavozim
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full h-10 rounded-lg">
                <SelectValue placeholder="Lavozimni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f-manager">F-manager</SelectItem>
                <SelectItem value="m-manager">M-manager</SelectItem>
                <SelectItem value="accountant">Bugalter</SelectItem>
                <SelectItem value="boss">Rahbar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Foydalanuvchi
            </label>
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-full h-10 rounded-lg">
                <SelectValue placeholder="Foydalanuvchini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Abbos Janizakov</SelectItem>
                <SelectItem value="2">Jasur Karimov</SelectItem>
                <SelectItem value="3">Sardor Aliyev</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || !role || !user}
            className="w-full h-11 rounded-xl bg-[#0078D4] text-white font-medium text-sm hover:bg-[#006CBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Yuborish
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
