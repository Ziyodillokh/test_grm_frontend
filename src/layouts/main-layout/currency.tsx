import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { getAllData } from "@/service/apiHelpers";
import api from "@/service/fetchInstance";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import { CurrencyData } from "./types";

function Currency() {
  const [active, setActive] = useState(false);
  const [uzs, setUZS] = useState<number>();
  const [usd, setUSD] = useState<number>();
  const token = useAuthStore((state) => state.token);
  const { meUser } = useMeStore();
  const { data, refetch } = useQuery({
    queryKey: ["currency", token, meUser],
    queryFn: () => getAllData<CurrencyData, unknown>("currency"),
  });

  const handleSave = () => {
    const body = {
      usd: String(usd),
      uzs: String(uzs),
      date: new Date(),
    };
    api
      .post("currency", body)
      .then(() => {
        toast.success("Сохранено");
        refetch();
      })
      .catch((err) => toast.error(String(err)));
  };

  return (
    <div className="relative">
      <Settings onClick={() => setActive(!active)} className="cursor-pointer" />
      {active && (
        <div className="absolute z-[99999999999] top-14 right-3 min-w-[335px] bg-[#E6E6D9] border border-border rounded px-5 py-4">
          <div className="flex justify-between items-center mb-[15px]">
            <p className="text-[#5D5D53] font-semibold text-sm">Курс валют</p>
            <button
              disabled={!usd && !uzs}
              onClick={() => handleSave()}
              className="text-[#5D5D53]/50 cursor-pointer font-semibold text-sm"
            >
              Сохранить
            </button>
          </div>
          <div className="flex justify-between gap-1 ">
            <div>
              <p className="text-[#5D5D53] w-[120px] font-normal">USD (США)</p>
              <div className="relative w-[120px]">
                <Input
                  onChange={(e) => setUSD(Number(e.target.value) || 0)}
                  type="number"
                  className="!w-full font-semibold !text-xl mt-2 bg-card"
                />
                <p className="absolute right-2 top-2 font-bold capitalize text-xl">
                  $
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#5D5D53] font-normal">UZS (Узбекистан)</p>
              <div className="relative ">
                <Input
                  onChange={(e) => setUZS(Number(e.target.value) || 0)}
                  type="number"
                  className="w-full font-semibold !text-xl  mt-2 bg-card"
                />
                <p className="absolute right-2 top-2 font-bold  text-xl">сум</p>
              </div>
            </div>
          </div>
          <p className="text-[#5D5D53] font-semibold text-sm mt-5 mb-2">
            История изминении
          </p>
          <div className="border border-border bg-card max-h-[200px] overflow-y-auto">
            {data?.items?.map((i) => (
              <div
                key={i.id}
                className="flex justify-between border-b border-border py-[7px] px-[13px]"
              >
                <p className="text-[#5D5D53] font-normal">
                  {i.uzs?.toLocaleString("uz-UZ")} сум
                </p>
                <p className="text-[#5D5D53] font-normal">
                  {format(i.date, "dd.mm.yyyy hh:mm")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Currency;
