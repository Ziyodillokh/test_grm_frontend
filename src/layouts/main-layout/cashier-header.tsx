
import { useQuery } from "@tanstack/react-query";

// import AddingParishOrFlow from "@/components/adding-parish-flow";
import { DollarIcon } from "@/components/icons";
import { getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";
import { IOpenKassa } from "@/types/api-type";

import { CurrencyData } from "./types";
import { useLocation } from "react-router-dom";

export default function CashierHeader({
  children
}:{
  children: React.ReactNode;
}) {
  const { meUser } = useMeStore();
  const token = useAuthStore((state) => state.token);
  const pathName = useLocation();

  const filialId = meUser?.filial.id;
  const { data } = useQuery({
    queryKey: [apiRoutes.openKassa, filialId],
    queryFn: () =>
      getByIdData<IOpenKassa, void>(apiRoutes.openKassa, filialId || ""),
    enabled: !!filialId,
  });

  const { data: currency } = useQuery({
    queryKey: ["currency", token, meUser],
    queryFn: () => getAllData<CurrencyData, unknown>("currency"),
  });
  // f-manager/report


  return (
    <header className="h-[90px] bg-background   flex ">
      {children}
      <div className="ml-8 w-full flex items-start  max-w-[312px] ">
        <div className="flex ">
          <DollarIcon />
              <div>
                <p className="text-[12px] ext-primary ">Касса:</p>
                <p className="text-[25px] font-bold text-primary">
                  {data?.in_hand}
                </p>
              </div>
        </div>
       { pathName.pathname!= "/f-manager/report" && pathName.pathname != "/f-manager/reports" && <div className="flex  items-center">
          <p className="text-[14px] leading-[17px] font-semibold text-foreground mx-2">
            {currency?.items?.[0]?.usd.toLocaleString("uz-UZ")} $
          </p>
          ~
          <p className="text-[14px] leading-[17px] font-semibold text-[#E38157]">
            {currency?.items?.[0]?.uzs?.toLocaleString("uz-UZ")} сум
          </p>
        </div>}
      </div>
    </header>
  );
}
