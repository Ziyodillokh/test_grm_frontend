import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeStore } from "@/store/me-store";
import FilialTable from "./filial-table";
import DealerTable from "./dealer-table";
import InternetTable from "./internet-table";
import PartiyaTable from "./partiya-table";

export default function SalesPage() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;

  // F_MANAGER (4) sees only filial tab — no tab UI needed
  if (role <= 7) {
    return <FilialTable />;
  }

  // I_MANAGER (8) sees filial + internet
  if (role === 8) {
    return (
      <Tabs defaultValue="filial" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="filial">Filial</TabsTrigger>
          <TabsTrigger value="internet">Internet</TabsTrigger>
        </TabsList>
        <TabsContent value="filial">
          <FilialTable />
        </TabsContent>
        <TabsContent value="internet">
          <InternetTable />
        </TabsContent>
      </Tabs>
    );
  }

  // M_MANAGER (9) / BOSS (12) — all 4 tabs
  return (
    <Tabs defaultValue="filial" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="filial">Filial</TabsTrigger>
        <TabsTrigger value="dealer">Diller</TabsTrigger>
        <TabsTrigger value="internet">Internet</TabsTrigger>
        <TabsTrigger value="partiya">Partiya</TabsTrigger>
      </TabsList>
      <TabsContent value="filial">
        <FilialTable />
      </TabsContent>
      <TabsContent value="dealer">
        <DealerTable />
      </TabsContent>
      <TabsContent value="internet">
        <InternetTable />
      </TabsContent>
      <TabsContent value="partiya">
        <PartiyaTable />
      </TabsContent>
    </Tabs>
  );
}
