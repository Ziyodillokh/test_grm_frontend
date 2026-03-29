import { BadgePercent, Gift, Plus, Tag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/filters-ui/search-input";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { useLocation } from "react-router-dom";

export default function Filters() {
  const navigate = useNavigate()
  const [, setId] = useQueryState("id");
  const pathName = useLocation().pathname;
  return (
    <div className=" flex justify-between  h-[64px] mb-3">
      <div className="flex  w-full gap-2 ">
        <SearchInput className="min-w-[300px]" />
        <div className={`bg-white flex gap-2 p-0.5 w-full max-w-[636px] rounded-[16px]`}>
          {[
            { label: "Цены", icon: Tag, path: "/price" },
            { label: "Акции", icon: Gift },
            { label: "Бонусы", icon: Tag },
            { label: "Промокоды", icon: Ticket },
            { label: "Скидки", icon: BadgePercent, path: "/discount" },
          ].map((item) => (
            <Button
              key={item.label}
              className={` ${pathName === item.path ? "bg-background" : "bg-white"
                } h-full rounded-[16px]   w-full max-w-[120px]`}
              variant="secondary"
              onClick={() => {
                if (item.path) navigate(item.path);
              }}
            >
              <item.icon />
              {item.label}
            </Button>
          ))}
        </div>

        {pathName === "/discount" && <Button onClick={() => setId("new")} className="h-full ml-auto  bg-white hover:bg-white rounded-[16px] w-[140px]  " variant={"secondary"} ><Plus size={24} /> Добавить</Button>}
      </div>
    </div>
  );
}
