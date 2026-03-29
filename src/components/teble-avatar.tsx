import { minio_img_url } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, CircleAlert, X } from "lucide-react";


const statusObj=  {
  panding:()=> <CircleAlert  stroke="white" fill="#E38157" className="absolute w-[18px] bottom-[-2px] left-[-2px]"/>,
  success:()=><div className=" flex items-center justify-center  border-white border-[1.5px] absolute  bottom-[-2px] left-[-2px]  w-[17px] h-[17px] rounded-full bg-[#89A143]"> <Check stroke="white"    className=" w-[12px]"/></div>,
  fail:()=> <div className=" flex items-center justify-center   border-white border-[1.5px]  absolute  bottom-[-2px] left-[-2px] w-[17px] h-[17px] rounded-full bg-[#E38157]"><X  stroke="white"    className=" w-[12px]" fill="#E38157" /></div>,
  none:()=><></>
}

export default function TebleAvatar({name,size, className,status="panding",url}:{name:string,size?:number;status?:string,className?:string,url?:string}) {
  return (
    <div className={`${className && className}   relative`}>
      <Avatar className={`w-[${size|| 50}px] border-white border-[2px]  h-[${ size || 50}px]`}>
            <AvatarImage
              src={minio_img_url + url || undefined}
            />
            <AvatarFallback className="bg-primary text-white  flex items-center justify-center">
              {name?.[0]}
            </AvatarFallback>
          </Avatar>
          {/* @ts-ignore */}
          {statusObj[status]()}
    </div>
  )
}
