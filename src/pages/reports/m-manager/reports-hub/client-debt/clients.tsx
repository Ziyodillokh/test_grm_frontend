import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import formatPrice from "@/utils/formatPrice";
import { useDebtClients } from "./queries";
import { clientColumns } from "./columns";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function ClientDebtClients() {
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { filialId } = useParams();
  const { data, isLoading } = useDebtClients(filialId);

  const basePath = location.pathname.includes("/f-manager/")
    ? "/f-manager/reports-hub/client-debt"
    : "/m-manager/reports-hub/client-debt";

  const items = data?.items || [];
  const summary = data?.summary || { totalOwed: 0, totalGiven: 0, balance: 0 };

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <p className="text-[16px] font-medium">Qarzdor Clientlar</p>
      </div>

      <div className="flex gap-4 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Jami qarz:</span>
          <span className="text-[#FF6600] font-semibold">
            {formatPrice(summary.totalOwed)} $
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Qaytarilgan:</span>
          <span className="text-[#89A143] font-semibold">
            {formatPrice(summary.totalGiven)} $
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Qoldiq:</span>
          <span className="font-bold">
            {formatPrice(summary.balance)} $
          </span>
        </div>
      </div>

      <DataTable
        columns={clientColumns}
        data={items}
        isLoading={isLoading}
        isRowClickble={false}
        onRowClick={(row: any) => {
          const path = `${basePath}/${filialId}/${row.id}`;
          push(row.firstName || row.name || "Mijoz", path);
          navigate(path);
        }}
      />
    </div>
  );
}
