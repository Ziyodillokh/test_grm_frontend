import { useMeStore } from "@/store/me-store";

import MonitoringDashboard from "../hr-monitoring";
import { SquareArrowOutDownLeft, SquareArrowOutUpRight, Tag } from "lucide-react";
import DashboardCard from "@/components/cards/dashboard-card";
import Filter from "./ui/filter";
import Cards from "./ui/cards";
import Kassa from "./ui/kassa";
import { useEffect, useState } from "react";
import { useReportsHomePageCurrentLeft, useReportsHomePageCurrentMonth } from "./queries";
import { parseAsString, useQueryState } from "nuqs";
import { getMonth } from "date-fns";
import { SheetDashboar } from "./tables";
import { formatNumber } from "@/utils/farmatNumber";
import { useYear } from "@/store/year-store";

export default function Dashboard() {
  const { meUser } = useMeStore();
  const [open, setOpen] = useState<string | null>(null);
  const [startDate] = useQueryState("startDate");
  const [endDate] = useQueryState("endDate");
  const [filial] = useQueryState("filial");
  const [, setManagerId] = useQueryState("managerId");
  const [month] = useQueryState("month", parseAsString.withDefault(getMonth(new Date()) + 1 + ""));
  const { year } = useYear()
  const role = meUser?.position.role;

  const { data } = useReportsHomePageCurrentMonth({
    queries: {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      filial_id: filial || undefined,
      month,
      year: year,
    },
    enabled: role === 12
  });
  const { data: leftData } = useReportsHomePageCurrentLeft({
    enabled: role === 12,
    queries: {
      year: year,
    }
  });

  useEffect(() => {
    if (open == "Маруф касса") {
      setManagerId(data?.manager?.id || "")
    } else if (open == "Мукаддас касса") {
      setManagerId(data?.accountant?.id || "")
    }
  }, [data, open])


  if (role === 11) {
    return <MonitoringDashboard />;
  }
  if (role === 12) {
    return (
      <div className="flex w-full   gap-2.5">
        <Cards setOpen={setOpen} leftData={leftData} />
        <div className="w-full mt-[27px] ">
          <Filter />
          <div onClick={() => setOpen('Продажа')} className="text-white cursor-pointer flex items-center rounded-xl gap-3 bg-[#333333] my-2.5 p-4 pl-6">
            <p className="text-[24px] mr-auto">Текущий месяц</p>
            <p className="text-[24px] opacity-50">{formatNumber(data?.totals?.total_kv || 0)} м²</p>
            <p className="text-[24px]">{formatNumber(data?.totals?.total_sum || 0)} $</p>
          </div>
          <div className="grid grid-cols-3  gap-2.5">
            <DashboardCard
              onClick={() => setOpen("Продажа в долг")}
              title="Продажа в долг"
              price={`${data?.order?.total_return || 0} $`}
              priceText={`Возврат`}
              price2={`${data?.debt_order?.total_sum || 0} $`}
            >
              <Tag className="my-2 text-[#FEDDCA] w-[20px] " />
            </DashboardCard>
            <DashboardCard
              onClick={() => setOpen("Прибыль")}
              title="Прибыль"
              price=""
              priceText={`Текущий месяц `}
              price2={`${data?.order?.total_profit_sum || 0} $`}
            >
              <SquareArrowOutDownLeft className="my-2 text-[#B1F0B3] w-[20px] " />
            </DashboardCard>
            <DashboardCard
              onClick={() => setOpen("Расход")}
              title="Расход"
              price={`${data?.boss?.boss_expense || 0} $`}
              priceText={`Босс`}
              price2={`${data?.boss?.total_expense || 0} $`}
            >
              <SquareArrowOutUpRight className="my-2 text-[#FFACAC] w-[20px]" />
            </DashboardCard>
          </div>
          <Kassa setOpen={setOpen} data={data} />
        </div>
        <SheetDashboar openType={open} onOpenChange={() => setOpen(null)} />
      </div>
    );
  }
  return <></>;
}
