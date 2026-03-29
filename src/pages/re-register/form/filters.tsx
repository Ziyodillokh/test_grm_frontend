import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import debounce from "@/utils/debounce";
import { QrCode } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export default function Filters() {
  const [, setBarcode] = useQueryState("barcode");
  const [active,setActive] = useState(false)
  const debouncedOnChange = debounce(setBarcode, 300)
  const handleKeyDown = (e:any) => {
    if (e.keyCode === 13) {
      debouncedOnChange(e.target.value?.trim())
    }
  }

  return (
    <div className="bg-sidebar border-b border-border w-full h-[64px]   flex   ">
      <Button 
        onClick={() => {
          setActive(true)
          const codeInput = document.querySelector('input[name="code"]');
          if (codeInput) {
            (codeInput as HTMLInputElement).select();
          }
        }}
      type="button"  className={`${active? "bg-primary hover:bg-primary text-white hover:text-white":''} h-full w-1/2  border-r-1  justify-center font-[16px] gap-1  border-y-0  border-l-0`} 
       variant={"outline"} > 
       <BrCodeIcons  color={active? "white":''}/> 
      Баркод
      
    </Button>
      <input  className="w-0" name="barCode" onKeyDown={handleKeyDown} />
      <Button  type="button" className="h-full  w-1/2  border-r-1  justify-center font-[16px] gap-1  border-y-0  border-l-0" 
       variant={"outline"} > 
       <QrCode /> 
      Баркод
    </Button>
    </div>
  );
}
