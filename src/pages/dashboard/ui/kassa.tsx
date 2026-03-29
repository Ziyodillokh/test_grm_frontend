import { Progress } from "@/components/ui/progress";
import { ReportsHomePageCurrentMonthData } from "../types";

export default function Kassa({
  data,
  setOpen
}:{
  data: ReportsHomePageCurrentMonthData | undefined,
  setOpen: (value: string) => void
}) {
  return (
    <div className="border border-border bg-white rounded-xl mt-2.5">
      <div onClick={()=>setOpen('Маруф касса')} className="hover:bg-[#F9F9F9] border-border   m-1 rounded-xl p-[25px]">
        <div className="flex items-center mb-2 gap-2 ">
          <p className="mr-auto text-[17px] text-[#333333]">Маруф касса</p>
          <p className=" text-[17px] opacity-30 text-[#333333]">Расход</p>
          <p className=" text-[17px] text-[#333333]">{data?.manager?.expense} $</p>
        </div>
        <Progress  classNameIndicator="bg-[#FEDDCA]" className="bg-[#F3F3F3] rounded-none" value={((data?.manager?.expense ||0) >=(data?.manager?.income ||0) ?100: (data?.manager?.expense||0)/(data?.manager?.income||0)*100) } />
        <p className="text-[24px] mt-2">{data?.manager?.income} $</p> 
      </div>
      <div className=" w-full h-[1px] bg-border"></div>
      <div onClick={()=>setOpen('Мукаддас касса')} className="hover:bg-[#F9F9F9] m-1 rounded-xl p-[25px]">
        <div className="flex items-center mb-2 gap-2 ">
          <p className="mr-auto text-[17px] text-[#333333]">Мукаддас касса</p>
          <p className=" text-[17px] opacity-30 text-[#333333]">Расход</p>
          <p className=" text-[17px] text-[#333333]">{data?.accountant?.expense} $</p>
        </div>
        <Progress classNameIndicator="bg-[#B8F2FD] " className="bg-[#F3F3F3] rounded-none" value={((data?.accountant?.expense ||0) >=(data?.accountant?.income ||0) ?100: (data?.accountant?.expense||0)/(data?.accountant?.income||0)*100) } />
        <p className="text-[24px] mt-2">{data?.accountant?.income} $</p>
      </div>
    </div>
  );
}
