import DashboardCard from '@/components/cards/dashboard-card'
import { DollarSign, Italic } from 'lucide-react'
import { ReportsHomePageCurrentLeftData } from '../types'
import { Progress } from '@/components/ui/progress'
import { parseAsFloat, useQueryState } from 'nuqs'

export default function Cards({ leftData, setOpen }: { leftData: ReportsHomePageCurrentLeftData | undefined, setOpen: (value: string) => void }) {

  const [, dellerowed] = useQueryState("dellerowed", parseAsFloat);
  const [, dellergiven] = useQueryState("dellergiven", parseAsFloat);
  return (
    <div className="w-full ">
      <h3 className="text-[72px] ml-[13px]">{leftData?.totals?.total_sum} $</h3>
      <p className="text-[17px] flex items-center gap-2 mb-10 -mt-2 ml-[20px]">
        {leftData?.totals?.total_profit_sum} сум прибль из итогого
        <Italic className="bg-white p-0.5 rounded-sm" />
      </p>

      <div className="grid grid-cols-3 gap-2.5">
        <DashboardCard
          title="Остатка"
          onClick={() => setOpen("Остатка")}
          icons={() => <DollarSign className="bg-gray-300 text-white w-[20px] h-[20px] p-1 rounded-full" />}
          price={`${leftData?.product?.total_kv} кв/м`}
          price2={`${leftData?.product?.total_sum} $`}
        >
          <div className="h-30"></div>
        </DashboardCard>
        <DashboardCard
          title="Кенты"
          onClick={() => setOpen("Кенты")}
          icons={() => <DollarSign className="bg-gray-300 text-white w-[20px] h-[20px] p-1 rounded-full" />}
          price={`+${leftData?.kents?.income} $`}
          price2={`-${leftData?.kents?.debt_balance} $`}
        >
          <div className="h-30"></div>
        </DashboardCard>
        <DashboardCard
          title="Дилер"
          onClick={() => {
            setOpen("Дилер")
            dellerowed(leftData?.dealer?.total_owed || 0)
            dellergiven(leftData?.dealer?.total_give || 0)
          }}
          icons={() => <DollarSign className="bg-gray-300 text-white w-[20px] h-[20px] p-1 rounded-full" />}
          price={`+${leftData?.dealer?.total_give} $`}
          price2={`-${leftData?.dealer?.total_owed}  $`}
        >
          <div className="h-30"></div>
        </DashboardCard>

        <DashboardCard
          title="План филиалов"
          onClick={() => setOpen("План филиалов")}
          icons={() => <DollarSign className="bg-gray-300 text-white w-[20px] h-[20px] p-1 rounded-full" />}
          price={`${leftData?.filial_plan_totals?.details?.currentTotalSell} $`}
          price2={`${Number(leftData?.filial_plan_totals?.percent)} %`}
        >
          <Progress classNameIndicator="bg-[#AFE9B1] " className="bg-[#F3F3F3] rotate-[-90deg] -ml-9 w-[80px]  my-15  rounded-none" value={Number(leftData?.filial_plan_totals?.percent) > 100 ? 100 : Number(leftData?.filial_plan_totals?.percent)} />

        </DashboardCard>
        <DashboardCard
          title="Индикатор продаж"
          // onClick={()=>setOpen("План сотрудников")}
          icons={() => <DollarSign className="bg-gray-300 text-white w-[20px] h-[20px] p-1 rounded-full" />}
          price={`${leftData?.user_plan_totals?.dailyCollected} $`}
          price2={`${leftData?.user_plan_totals?.gapPercent} %`}
        >
          <Progress classNameIndicator="bg-[#FF9C8B] h-full " className="bg-[#F3F3F3]  rotate-[-90deg] w-[80px]  -ml-9 my-15 rounded-none" value={Number(leftData?.user_plan_totals?.gapPercent)} />

        </DashboardCard>
      </div>


    </div>
  )
}
