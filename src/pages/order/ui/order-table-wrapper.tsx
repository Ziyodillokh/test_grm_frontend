import clsx from "clsx";

import { IOrderTable } from "../type";

export default function OrderTableWrapper({
  title,
  Colms,
  children,
  className,
}: IOrderTable) {
  return (
    <div
      className={clsx(
        "w-full bg-card rounded-md",
        className
      )}
    >
      <p className="text-[12px] leading-[14px] text-primaty py-[9px] px-[11px]">
        {title}
      </p>
      <ul className="w-full">
        {Colms && (
          <li className="w-full flex gap-2 items-center px-[11px] py-[3px]  bg-card  border-b">
            {Colms.map((e: string, i: number) => (
              <p
                key={i}
                className="text-primaty text-[12px] leading-[14px] w-full"
              >
                {e}
              </p>
            ))}
          </li>
        )}

        {children}
      </ul>
    </div>
  );
}