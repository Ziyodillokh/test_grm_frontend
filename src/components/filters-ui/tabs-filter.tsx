import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { IData } from "@/pages/cashier/home/type";
import { TQuery } from "@/pages/employees/type";
import { getAllData } from "@/service/apiHelpers";
import { TResponse } from "@/types";
import { useMeStore } from "@/store/me-store";

export default function TabsFilter() {
  const { meUser } = useMeStore()
  const { data } = useQuery({
    queryKey: ["/filial/warehouse-and-filial"],
    queryFn: () =>
      getAllData<TResponse<IData>, TQuery>("/filial/warehouse-and-filial",
        {
          limit: 50
        }
      ),
    select: (res) => ({
      data: res?.items
        .filter((i) => i.type !== "market")
        .sort((a, b) =>
          a.type === "warehouse" ? -1 : b.type === "warehouse" ? 1 : 0
        )
        .sort((a, b) =>
          a.type === "dealer" ? 1 : b.type === "dealer" ? -1 : 0
        )
        .sort((a, b) =>
          a.id === meUser?.filial?.id ? -1 : b.id === meUser?.filial?.id ? 1 : 0
        ),
      meta: res.meta,
    }),
  });

  const [filial, setFilial] = useQueryState("filial", parseAsString.withDefault(meUser?.filial?.id || ""));



  return (
    <div className="flex  gap-1 ">
      {!meUser?.filial?.id ? <p
        className={`border-r border-border px-4 py-2.5 text-nowrap cursor-pointer ${!filial ? "bg-primary text-sidebar" : "bg-background text-foreground"
          }`}
        onClick={() => setFilial(null)} // Clear filial param
      >
        All
      </p> : ""}

      {data?.data?.map((e) => (
        <p
          key={e?.id}
          className={` rounded-lg px-4 py-2.5 text-nowrap cursor-pointer ${filial === e?.id
            ? "bg-primary text-sidebar"
            : "bg-card "
            }`}
          onClick={() => setFilial(e?.id)}
        >
          {e?.title}
        </p>
      ))}
    </div>
  );
}
