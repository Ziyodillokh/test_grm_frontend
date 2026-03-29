import { QrCode } from "lucide-react";

import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Filters() {
  return (
    <div className="bg-sidebar border-b border-border  h-[64px]    flex   ">
      <Button className="h-full border-r-1 w-[170px] text-white  justify-center font-[16px] gap-1  border-y-0  border-l-0">
        <BrCodeIcons color="white" />
        Баркод
      </Button>
      <Button
        className="h-full border-r-1 w-[170px] justify-center font-[16px] gap-1  border-y-0  border-l-0"
        variant={"outline"}
      >
        <QrCode />
        QR код
      </Button>
    </div>
  );
}
