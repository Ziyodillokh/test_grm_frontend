import { parseAsString, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";
import FilialTable from "./filial-table";
import DealerTable from "./dealer-table";
import InternetTable from "./internet-table";
import PartiyaTable from "./partiya-table";

export default function SalesPage() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const [view] = useQueryState("view", parseAsString.withDefault("filial"));

  if (role <= 7) return <FilialTable />;

  if (view === "dealer") return <DealerTable />;
  if (view === "internet") return <InternetTable />;
  if (view === "partiya") return <PartiyaTable />;
  return <FilialTable />;
}
