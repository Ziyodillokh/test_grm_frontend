import { useQuery } from "@tanstack/react-query";
import { ReactElement, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { getAllData } from "@/service/apiHelpers";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import Currency from "./currency";
import { DataMenu } from "./menu-datas";
import { CurrencyData } from "./types";
import { useQueryState } from "nuqs";

type Tmenu = {
  id: number;
  icons: () => ReactElement;
  link: string;
  text: string;
  items: {
    id: number;
    link: string;
    text: string;
  }[];
};
export default function Header() {
  const token = useAuthStore((state) => state.token);
  const { meUser } = useMeStore();
  const [itemName] = useQueryState("itemName")

  const location = useLocation();
  const { data: currency } = useQuery({
    queryKey: ["currency", token, meUser],
    queryFn: () => getAllData<CurrencyData, unknown>("currency"),
  });
  useEffect(() => {
    localStorage.setItem(
      "currencyNow",
      JSON.stringify(
        (currency?.items?.[0].uzs || 0) / (currency?.items?.[0].usd || 1)
      )
    );
  }, [currency]);

  const oneMenu = DataMenu?.[
    meUser?.position?.role as keyof typeof DataMenu
  ]?.find((e) => location.pathname.includes(e?.link));

  return (
    <div className="flex items-center gap-5 w-full h-[64px] pl-4  py-[23px] bg-background ">
      <div className={`${(oneMenu as Tmenu)?.items?.length >2 ?"justify-center":""} flex items-center w-full `}>
        <div className={`${(oneMenu as Tmenu)?.items?.length >2 ?"bg-card":""} flex    items-center  h-[50px] p-1 rounded-xl  gap-4 text-[14px] leading-[16px] text-foreground`}>
          {(oneMenu as Tmenu)?.items?.length ? (
            (oneMenu as Tmenu)?.items.map((e) => (
              <Link
                key={e?.id}
                className={ location.pathname.includes(e?.link) || location.pathname+ "s" == e?.link ?  "bg-primary  text-card flex items-center justify-center px-3  h-full rounded-xl" : "h-full flex items-center justify-center pl-3  last:pr-6"}
                to={e?.link}
              >
                {e.text} 
              </Link>
            ))
          ) : (
            <div className="flex itmes-center gap-2">

            <Link to={oneMenu?.link || "/"}>{oneMenu?.text}</Link>
             {itemName ? "/" :""} {itemName}
            </div>
          )}
        </div>
      </div>
    
      <div className=" w-full flex gap-2 max-w-[200px] ">
          <p className="text-[14px] leading-[17px] font-semibold text-foreground">
            {currency?.items?.[0]?.usd.toLocaleString("uz-UZ")} $
          </p>
          <p className="text-[14px] leading-[17px] font-semibold text-[#E38157]">
            {currency?.items?.[0]?.uzs.toLocaleString("uz-UZ")} сум
          </p>
        </div>
        {meUser?.position?.role === 9 && <Currency />}
    </div>
  );
}
