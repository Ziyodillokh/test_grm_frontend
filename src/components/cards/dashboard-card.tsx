import { PropsWithChildren } from "react";


interface DashboardCardProps extends PropsWithChildren {
    className?: string;
    title:string,
    icons?:any,
    price:string,
    price2:string,
    priceText?:string,
    onClick?:()=>void
  }
export default function DashboardCard({
    title,
    icons,
    price,
    price2,
    children,
    className = "",
    onClick,
    priceText
}:DashboardCardProps) {
  return (
    <div onClick={onClick} className={`${className} p-[30px] rounded-2xl bg-white border-border border`}>
        <div className="flex items-center mb-auto justify-between"> 
            <p className="text-[17px] text-nowrap">{title}</p>
            { icons&&icons()}
        </div>
        {children}
        <p className="text-[15px ">{price} 
          <span className="inline-block text-[#333333] opacity-40 ml-1">  {priceText}</span>
        </p>
        <p className="text-[24px] text-nowrap mt-1">{price2}</p>
    </div>
  )
}
