import { Download, Printer, Share2 } from "lucide-react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

import BarcodeGenerator from "./react-barcode";
import { Button } from "./ui/button";

export default function BarcodeQenerat() {
  const { watch } = useFormContext();
  const WatchValue = watch();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    // @ts-ignore
    content: () => {
      if (!printRef.current) {
        return null;
      }
      return printRef.current;
    },
    documentTitle: "Barcode Print",
    removeAfterPrint: true,
  });


  return (
    <div className="w-full">
      <div className="bg-sidebar border-y border-border  h-[64px]   flex   ">
        <Button
          type="button"
          className="h-full w-1/2 border-r-1 text-primary  justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
          variant={"outline"}
        >
          Штрих-код
        </Button>
        <Button
          type="button"
          className="h-full  w-1/2  border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
          variant={"outline"}
        >
          QR-код
        </Button>
      </div>
      <div ref={printRef} className="p-[30px] max-w-[500px] text-center mx-auto barcode-label">
        <div className="bg-white rounded-1 px-11 py-[24px]  text-center">
          <h4 className="font-bold text-[24px] ">
            {WatchValue?.collection?.label}
          </h4>
          <div className="flex items-center justify-center details gap-[15px]">
            <p className="font-medium text-[15px]">
              {WatchValue?.model?.label}
            </p>
            <p className="font-medium text-[15px]">{WatchValue?.size?.label}</p>
            <p className="font-medium text-[15px]">
              {WatchValue?.color?.label}
            </p>
          </div>
          <BarcodeGenerator value={WatchValue?.code || ""} />
        </div>
      </div>
      <div className="bg-sidebar border-y text-primary border-border  h-[44px] flex">
        <Button
          type="button"
          className="h-full border-r-1 w-1/3 justify-center font-[16px] gap-1  border-y-0  border-l-0"
          variant={"outline"}
        >
          <Share2 size={16} />
          Поделится
        </Button>
        <Button
          onClick={() => handlePrint()}
          type="button"
          className="h-full w-1/3 border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
          variant={"outline"}
        >
          <Printer size={16} />
          Распечатать
        </Button>
        <Button
          type="button"
          className="h-full w-1/3 border-r-1 text-primary justify-center font-[16px] gap-1.5  border-y-0  border-l-0"
          variant={"outline"}
        >
          <Download size={16} />
          Скачать
        </Button>
      </div>
    </div>
  );
}
