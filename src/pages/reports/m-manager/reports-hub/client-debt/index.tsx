import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import formatPrice from "@/utils/formatPrice";
import { useDebtFilials } from "./queries";
import { filialColumns } from "./columns";

export default function ClientDebtFilials() {
  const navigate = useNavigate();
  const { data, isLoading } = useDebtFilials();

  const items = data?.items || [];
  const totals = data?.totals || { totalOwed: 0, totalGiven: 0, balance: 0 };

  return (
    <div>
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <p className="text-[16px] font-medium mr-auto">Qarz Hisoboti</p>
      </div>

      <div className="flex gap-4 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Jami qarz:</span>
          <span className="text-[#FF6600] font-semibold">
            {formatPrice(totals.totalOwed)} $
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Qaytarilgan:</span>
          <span className="text-[#89A143] font-semibold">
            {formatPrice(totals.totalGiven)} $
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Qoldiq:</span>
          <span className="font-bold">
            {formatPrice(totals.balance)} $
          </span>
        </div>
      </div>

      <DataTable
        columns={filialColumns}
        data={items}
        isLoading={isLoading}
        isRowClickble={false}
        onRowClick={(row: any) =>
          navigate(`/m-manager/reports-hub/client-debt/${row.filialId}`)
        }
      />
    </div>
  );
}
