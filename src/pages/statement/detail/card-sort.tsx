import { DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Statement } from "../type";



export default function CardSort({
  columnData,
}:{columnData:Statement | undefined}) {
const isReportLoading = false

  interface TColumns {
    title: string;
    value: string;
    price: React.ReactNode;
    button?: React.ReactNode;
  }

  const hrColumns = [
    {
      title: "Наличному",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(columnData?.in_hand||0)
      ),
    },
    {
      title: "Пластик",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice( columnData?.plastic || 0)
      ),
    },
    {
      title: "Бонус",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(columnData?.bonus as unknown as number || 0 )
      ),
    },
    {
      title: "Аванс",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(columnData?.prepayment || 0 )
      ),
    },
    {
      title: "Премя",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(columnData?.award as unknown as number  || 0 )
      ),
    },
  ];

  function formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }

  return (
    <>
        <div className="flex ">
          <div
            className=" bg-sidebar/20 cursor-pointer p-5 w-full border border-t border-r max-w-[399px]"
          >
            <div className="flex items-center">
              <DollarSign size={54} />
              <div>
                <p className="text-[12px] ">Итого</p>
                {isReportLoading ? (
                  <Skeleton className="h-7 w-24 mt-1" />
                ) : (
                  <p className="text-[25px] font-bold text-foreground">
                    {formatPrice(columnData?.total || 0)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="grid row-start w-full  border-border  border-b grid-cols-4  ">
            {(hrColumns as unknown as TColumns[])?.map((e) => (
              <div
                key={e.title}
                className={` bg-sidebar/20  text-primary border-t border-r border-border cursor-pointer px-4 py-5`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-[12px] mb-0.5 flex items">{e.title}</p>
               
                </div>
                <p className="text-[15px] font-medium">{e.price}</p>
              </div>
            ))}
          </div>
        </div>

  
    </>
  );
}
