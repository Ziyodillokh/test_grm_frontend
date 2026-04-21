import { useNavigate } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { getMonth } from "date-fns";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

import Filter from "./filter";
import { useDataSellerReports } from "./queries";

const gridTemplate = "60px 1fr 80px 80px 120px 120px 120px";
const columnLabels = ["", "Ism", "Soni", "Hajm", "Sotuv", "Skidka", "Planka"];

export default function PageSellerReport() {
  const { meUser } = useMeStore();
  const { year } = useYear();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const [month] = useQueryState("month", parseAsString.withDefault(String(getMonth(new Date()) + 1)));
  const [filial] = useQueryState("filial");

  const { data, isLoading } = useDataSellerReports({
    queries: {
      filialId:
        meUser?.position?.role == 4 ? meUser?.filial?.id : filial || "all",
      page: 1,
      limit: 10,
      month: month || undefined,
      year,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="flex flex-col h-full">
      <Filter />

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[12px]"
              minHeight={60}
              onClick={() => {
                const fullName = `${item.firstName} ${item.lastName}`;
                const name = encodeURIComponent(fullName);
                const path = `${item.id}/info?month=${month}&userName=${name}`;
                push(fullName, path);
                navigate(path);
              }}
            >
              <div className="flex items-center justify-center">
                <TebleAvatar
                  url={item.avatar?.path}
                  status="none"
                  name={item.firstName}
                  size={40}
                />
              </div>
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {item.firstName} {item.lastName}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">{item.count || 0}</span>
              <span className="text-[13px] text-[#1a1a1a]">{item.kv || 0} m²</span>
              <span className="text-[13px] font-medium text-[#47B13C]">
                {formatPrice(Number(item.earn || 0))} $
              </span>
              <span className="text-[13px] text-[#FF6600]">
                {formatPrice(Number(item.discount || 0))} $
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {formatPrice(Number(item.plan_price || 0))} $
              </span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
