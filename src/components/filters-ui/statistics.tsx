import { SquareCheckBig } from "lucide-react";

export default function Statistics() {
  return (
    <div className=" text-nowrap p-5 flex gap-4 items-center  h-full bg-card rounded-xl">
      <p className="flex text-[14px] items-center gap-1 opacity-40">
        {" "}
        <SquareCheckBig size={16} /> Найдено:
      </p>
      <p className="text-[14px] text-foreground">0 шт</p>
      <p className="text-[14px] text-foreground">0 шт</p>
      <p className="text-[14px] text-foreground">0 шт</p>
    </div>
  );
}
