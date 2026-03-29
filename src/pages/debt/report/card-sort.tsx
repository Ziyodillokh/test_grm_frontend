import {  DollarSign } from "lucide-react";
import { TData } from "../type";


export default function CardSort({SortData}:{SortData?:TData}) {

  const columns = [
    {
      title: "Взято",
      price:formatPrice( SortData?.owed || 0 )
    },
    {
      title: "Дано",
      price:formatPrice( SortData?.given || 0 )
    },
    {
      title: "Остаток долга",
      price:formatPrice( (SortData?.owed || 0) - (SortData?.given || 0)  )
    },
  ];


  function formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }


  return (
      <div className=" flex bg-sidebar">
        <div className="bg-sidebar p-5 pl-7 w-full border-border border-r max-w-[399px]">
          <div className="flex items-center">
            <DollarSign size={54} />
            <div>
              <p className="text-[12px] ">Итого задолжность</p>
                <p className="text-[25px] font-bold text-foreground">{formatPrice(SortData?.totalDebt || 0)}</p>
            </div>
          </div>
          <p className="text-[12px] mt-[15px] mb-1 text-[#5D5D53]">
          Период:
          </p>
          <p className="text-[14px] font-semibold">0 м²</p>
        </div>
        <div className="grid row-start w-full  grid-cols-3  ">
          {columns?.map((e) => (
            <div
              key={e.title}
              className={`bg-sidebar  text-primary" h-[78px] border-border border-r border-b  flex justify-between items-center cursor-pointer px-4 py-5`}
            >
              <div className="">
                <p className="text-[12px] mb-0.5 flex  items">{e.title}</p>
                <p className="text-[15px]  font-medium">{e.price}</p>
              </div>
          
            </div>
          ))}
        </div>
      </div>
          
   
  );
}
