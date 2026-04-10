import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeStore } from "@/store/me-store";
import CountryTable from "./county-table";
import PartiyaTable from "./partiya-table";

export default function InventoryPage() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9; // M_MANAGER=9, BOSS=12

  if (!isManager) {
    // F_MANAGER / W_MANAGER — only filial tab, no tabs UI needed
    return <CountryTable />;
  }

  return (
    <Tabs defaultValue="filial" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="filial">Filial bo'yicha</TabsTrigger>
        <TabsTrigger value="partiya">Partiya bo'yicha</TabsTrigger>
      </TabsList>
      <TabsContent value="filial">
        <CountryTable />
      </TabsContent>
      <TabsContent value="partiya">
        <PartiyaTable />
      </TabsContent>
    </Tabs>
  );
}
