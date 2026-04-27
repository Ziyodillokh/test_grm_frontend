import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import debounce from "@/utils/debounce";
import { FileOutput, Loader } from "lucide-react";
import { useQueryState } from "nuqs";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";

import { UploadFile } from "@/service/apiHelpers";
import { useMeStore } from "@/store/me-store";

const MAX_FILE_SIZE = 5_000_000;

export default function Filters() {
  const [, setBarcode] = useQueryState("barcode");
  const [active, setActive] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const { id: partiyaId } = useParams();
  const { meUser } = useMeStore();
  const role = meUser?.position?.role;
  // F-manager (4) va W-manager (7) uchun Excel yuklash hide
  const canUploadExcel = role !== 4 && role !== 7;

  const debouncedOnChange = debounce(setBarcode, 300);
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      debouncedOnChange(e.target.value?.trim());
    }
  };

  const handleExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE) return;
    setLoadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("partiyaId", partiyaId || "");
    try {
      await UploadFile(`/excel`, formData);
    } finally {
      setLoadingFile(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-sidebar border-b border-border w-full h-[56px] flex">
      <Button
        onClick={() => {
          setActive(true);
          const codeInput = document.querySelector('input[name="code"]');
          if (codeInput) {
            (codeInput as HTMLInputElement).select();
          }
        }}
        type="button"
        className={`${active ? "bg-primary hover:bg-primary text-white hover:text-white" : ""} h-full ${canUploadExcel ? "w-1/2 border-r border-border" : "w-full"} justify-center text-[14px] gap-2 border-y-0 border-l-0 rounded-none`}
        variant="outline"
      >
        <BrCodeIcons color={active ? "white" : ""} />
        Shtrix-kod skanerlash
      </Button>
      <input className="w-0" name="barCode" onKeyDown={handleKeyDown} />

      {canUploadExcel && (
        <label className="h-full w-1/2 flex items-center justify-center gap-2 cursor-pointer text-[14px] hover:bg-[#f5f7f9] transition">
          {loadingFile ? <Loader size={18} className="animate-spin" /> : <FileOutput size={18} />}
          Excel yuklash
          <input
            className="hidden"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleExcel}
          />
        </label>
      )}
    </div>
  );
}
