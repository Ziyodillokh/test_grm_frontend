import { parseAsString, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";
import CountryTable from "./county-table";
import PartiyaTable from "./partiya-table";

export default function InventoryPage() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;
  const [view] = useQueryState("view", parseAsString.withDefault("filial"));

  if (!isManager || view === "filial") {
    return <CountryTable />;
  }

  return <PartiyaTable />;
}
