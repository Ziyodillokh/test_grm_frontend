import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useQueryState } from "nuqs";

export default function Filters() {
  const [, setBarcode] = useQueryState("barcode");
  const handleKeyDown = (e:any) => {
    if (e.keyCode === 13) {
      setBarcode(e.target.value?.trim())
    }
}

  return (
    <div className="bg-sidebar border-b border-border w-full h-[64px]  flex   ">
      <Button 
        onClick={() => {
          const codeInput = document.querySelector('input[name="code"]');
          if (codeInput) {
            (codeInput as HTMLInputElement).select();
          }
        }}
      type="button" className="h-full w-1/2  border-r-1  justify-center font-[16px] gap-1  border-y-0  border-l-0" 
       variant={"outline"} > 
       <BrCodeIcons/> 
      Баркод
    </Button>
      <input  className="w-0" name="barcode" onKeyDown={handleKeyDown} />
      <Button  type="button" className="h-full  w-1/2  border-r-1  justify-center font-[16px] gap-1  border-y-0  border-l-0" 
       variant={"outline"} > 
       <QrCode/> 
      Баркод
    </Button>
    </div>
  );
}
