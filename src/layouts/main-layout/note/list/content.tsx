import { format } from "date-fns";

import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

import ActionPage from "../form";
import { TData } from "../types";

export default function Content({ data }: { data: TData[] }) {
  return (
    <div className="relative">
      <ActionPage />
      {data &&
        data?.map((item) => (
          <div
            key={item?.id}
            style={{ backgroundColor: item?.color }}
            className={`
          ${item?.color == "none" ? "border-border border text-primary" : `text-white `} 
          w-full  mb-2 p-5 rounded-[12px]
          ${data?.indexOf(item) % 2 === 0 ? "-rotate-1" : "rotate-1"}
          `}
          >
            <p className="font-semibold text-[18px]">{item?.title}</p>
            <div  className="flex justify-between">
              <p className="mt-2.5  text-[12px]">
                {format(item?.updated_at, "dd.MM.yyyy")}
              </p>
              <TableAction ShowDelete id={item?.id} url={apiRoutes.notes} />
            </div>
          </div>
        ))}
    </div>
  );
}
