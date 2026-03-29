import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Years } from "@/consts";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
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
  printRef: RefObject<HTMLDivElement | null>;
};

export default function RightConent({ printRef }: RightContentProps) {
  const { meUser } = useMeStore();
  const {year,setYear}= useYear()
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(getMonth(new Date()) + 1 + "")
  );
  const [filial] = useQueryState("filial");

  const { mutate } = useMutation({
    mutationFn: async (type: string) => {
      const query = {
        month: +month || undefined,
        tur: type =="all" ? undefined: type,
        year:year,
        filialId:
          meUser?.position?.role == 4
            ? meUser?.filial?.id
            : filial || undefined,
      };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";
        const url = type =="all"?  apiRoutes.paperReportExportExcel :apiRoutes.paperReportUniversalExcel 
      window.location.href =  import.meta.env.VITE_BASE_URL + url + params 
    },
  });

  interface IType {
    label: string;
    value: string;
  }

  const { data } = useQuery({
    queryKey: ["paper-report/array/get-all-types", meUser],
    queryFn: () =>
      getAllData<IType[], unknown>("/paper-report/array/get-all-types"),
  });

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
      <div className="p-1.5 pt-0 flex i gap-2 text-[#272727]">
        <Select
          onValueChange={(value) => {
            mutate(value);
          }}
        >
          <SelectTrigger
            className={`outline-none active:border-none w-full p-0 pr-2 border-none bg-white rounded-lg `}
          >
            <div
              // onClick={() => mutate()}
              className="flex cursor-pointer text-nowrap items-center py-[13px] px-[23px] rounded-lg bg-white text-[16px] font-normal gap-2"
            >
              <FileInput size={20} />  Excel
            </div>
          </SelectTrigger>
          {data && (
            <SelectContent className="bg-white">
               <SelectItem
                  className="bg-white focus:bg-white  hover:bg-white"
                  value={"all"}
                >
                  Umumiy hisobot
                </SelectItem>
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
        <div
          onClick={() => handlePrint()}
          className="flex  cursor-pointer items-center p-2 px-5 rounded-lg bg-white text-[16px] font-normal gap-1"
        >
          <Printer size={20} />
        </div>
      </div>

      <p className="border-t mt-auto text-[12px] h-[56px] px-[31px] text-[#272727] py-[18px] border-border">
        Годовой отчет
      </p>
      <div className="p-1.5 pt-0 w-full">
        {Years?.map((item) => (
          <p
            onClick={() => setYear(item)}
            className={`${year == item ? "bg-card" : ""} w-full text-[#272727] cursor-pointer rounded-lg text-[16px] font-medium px-[26px] py-[12px]  `}
          >
            {item}-yil hisoboti
          </p>
        ))} 
      </div>
    </div>
  );
}
