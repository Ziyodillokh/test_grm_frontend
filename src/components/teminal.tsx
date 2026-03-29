import { Loader } from "lucide-react"

interface ITeminal {
    title:string
}
export default function Teminal({title}:ITeminal) {
  return (
    <div className="bg-black w-full text-primary">
        <p className="w-full border-border border-b px-[25px] py-[20px] flex gap-1 items-center  text-[14px] font-medium"><Loader size={16} /> {title}</p>
        <div className="px-[41px] py-[26px]">
            <p className="text-[#00FF19]   text-[14px] font-medium">Файл: Ghetaran_1200_Iran_12.02.2025.xlxs  download</p>
        </div>
    </div>
  )
}
