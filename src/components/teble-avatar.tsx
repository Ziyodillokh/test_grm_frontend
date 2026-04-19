import { minio_img_url } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, CircleAlert, X } from "lucide-react";


const statusObj=  {
  panding:()=> <CircleAlert  stroke="white" fill="#E38157" className="absolute w-[18px] bottom-[-2px] left-[-2px]"/>,
  success:()=><div className=" flex items-center justify-center  border-white border-[1.5px] absolute  bottom-[-2px] left-[-2px]  w-[17px] h-[17px] rounded-full bg-[#89A143]"> <Check stroke="white"    className=" w-[12px]"/></div>,
  fail:()=> <div className=" flex items-center justify-center   border-white border-[1.5px]  absolute  bottom-[-2px] left-[-2px] w-[17px] h-[17px] rounded-full bg-[#E38157]"><X  stroke="white"    className=" w-[12px]" fill="#E38157" /></div>,
  return:()=> <div className=" flex items-center justify-center   border-white border-[1.5px]  absolute  bottom-[-2px] left-[-2px] w-[17px] h-[17px] rounded-full bg-[#EF5C12]"><svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.99907 3.33333L5.3324 4.66667M5.3324 3.33333L3.99907 4.66667M6.66573 2C6.75414 2 6.83892 2.03512 6.90144 2.09763C6.96395 2.16014 6.99907 2.24493 6.99907 2.33333V5.66667C6.99907 5.75507 6.96395 5.83986 6.90144 5.90237C6.83892 5.96488 6.75414 6 6.66573 6H2.99907L1.3324 4.33333C1.25041 4.24166 1.20508 4.12299 1.20508 4C1.20508 3.87701 1.25041 3.75834 1.3324 3.66667L2.99907 2H6.66573Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
  none:()=><></>
}

export default function TebleAvatar({name,size=50, className,status="panding",url}:{name:string,size?:number;status?:string,className?:string,url?:string}) {
  return (
    <div className={`${className && className}   relative`}>
      <Avatar className="border-white border-[2px]" style={{ width: size, height: size }}>
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
