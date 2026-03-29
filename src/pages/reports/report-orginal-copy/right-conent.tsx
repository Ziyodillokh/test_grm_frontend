import { SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { Select } from "@radix-ui/react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMonth } from "date-fns";
import { FileInput, Printer } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import qs from "qs";
import { RefObject } from "react";
import { useReactToPrint } from "react-to-print";

type RightContentProps = {
  printRef: RefObject<HTMLDivElement | null> ;
};

export default function RightConent({printRef}:RightContentProps) {
  const { meUser } = useMeStore();
const {year} = useYear()

  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const [filial] = useQueryState("filial");

  const { mutate } = useMutation({
    mutationFn: async (type:string) => {
      const query = {
        month: +month || undefined,
        tur:type,
        year,
        filialId:
          meUser?.position?.role == 4
            ? meUser?.filial?.id
            : filial || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";
      const blob = await api.get(apiRoutes.paperReportUniversalExcel + params, {
        responseType: "blob",
      });
      if (!(blob.data instanceof Blob)) {
        throw new Error("Received data is not a Blob");
      }
      const blobUrl = window.URL.createObjectURL(blob.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    },
  });

  // /paper-report/array/get-all-types
interface IType {
  label: string;
  value: string;
}

  const { data } = useQuery({
    queryKey: ["paper-report/array/get-all-types", meUser],
    queryFn: () => getAllData<IType[], unknown>('/paper-report/array/get-all-types'),
  })

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    // @ts-ignore
    content: () => {
      if (!printRef.current) {
        return null;
      }
      return printRef.current;
    },
    documentTitle: "Хисобот",
    removeAfterPrint: true,
  });

  return (
    <div className="w-[380px] h-full">
      <p className="border-b mt-auto h-[56px] px-[31px] text-[#272727] py-[18px] border-border">
        Годовой отчет
      </p>

      <div className="p-[24px] text-[#272727]">
       
        <Select
        onValueChange={(value)=>{
            mutate(value)
        }}
    >
      <SelectTrigger className={`outline-none active:border-none p-0 pr-2 border-none bg-white rounded-sm `}>
        <div
          // onClick={() => mutate()}
          className="flex cursor-pointer items-center py-[13px] px-[23px] rounded-sm bg-white text-[16px] font-normal gap-1"
        >
          <FileInput size={20} /> Экспорт в Excel
        </div>
      </SelectTrigger>
      {data && (
        <SelectContent  className="bg-white">
          {data?.map((option) => (
            <SelectItem
              key={option.value}
             
              className="bg-white focus:bg-white  hover:bg-white"
              value={String(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      )} 
    </Select>
        <div onClick={()=>handlePrint()} className="flex  cursor-pointer mt-2 items-center py-[13px] px-[23px] rounded-sm bg-white text-[16px] font-normal gap-1">
          <Printer size={20} /> Распечатать
        </div>
      </div>
    </div>
  );
}
