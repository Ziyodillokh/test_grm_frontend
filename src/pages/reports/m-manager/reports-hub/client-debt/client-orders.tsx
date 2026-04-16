import { useNavigate, useParams } from "react-router-dom";
import { parseAsInteger, useQueryState } from "nuqs";
import { DataTable } from "@/components/ui/data-table";
import formatPrice from "@/utils/formatPrice";
import { useDebtOrders } from "./queries";
import { orderColumns } from "./columns";

const currentYear = new Date().getFullYear();

export default function ClientDebtOrders() {
  const navigate = useNavigate();
  const { filialId, clientId } = useParams();
  const [year, setYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(currentYear)
  );
  const [month, setMonth] = useQueryState("month", parseAsInteger);

  const { data, isLoading } = useDebtOrders(clientId, {
    year,
    month: month || undefined,
    page: 1,
    limit: 100,
  });

  const items = data?.items || [];
  const client = data?.client || {};

  const totalKv = items.reduce(
    (acc: number, o: any) => acc + Number(o.kv || 0),
    0
  );
  const totalPrice = items.reduce(
    (acc: number, o: any) => acc + Number(o.price || 0),
    0
  );

  return (
    <div>
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <button
          onClick={() => navigate("/m-manager/reports-hub/client-debt")}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Qarz Hisoboti
        </button>
        <span className="text-muted-foreground">/</span>
        <button
          onClick={() =>
            navigate(`/m-manager/reports-hub/client-debt/${filialId}`)
          }
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Clientlar
        </button>
        <span className="text-muted-foreground">/</span>
        <p className="text-[16px] font-medium">
          {client.fullName || "Client"}
        </p>
      </div>

      {client.id && (
        <div className="flex gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Qarz:</span>
            <span className="text-[#FF6600] font-semibold">
              {formatPrice(client.owed || 0)} $
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Qaytarilgan:</span>
            <span className="text-[#89A143] font-semibold">
              {formatPrice(client.given || 0)} $
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Qoldiq:</span>
            <span className="font-bold">
              {formatPrice(client.balance || 0)} $
            </span>
          </div>
          {client.phone && (
            <div className="flex items-center gap-2 text-sm ml-auto">
              <span className="text-muted-foreground">{client.phone}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-2">
        <select
          className="border rounded-md px-3 py-1.5 text-sm bg-background"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
        >
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-1.5 text-sm bg-background"
          value={month || ""}
          onChange={(e) => setMonth(e.target.value ? +e.target.value : null)}
        >
          <option value="">Barcha oylar</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString("uz-UZ", { month: "long" })}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-4 text-sm text-muted-foreground">
          <span>{items.length} ta order</span>
          <span>{totalKv.toFixed(2)} m²</span>
          <span className="font-medium text-foreground">
            {formatPrice(totalPrice)} $
          </span>
        </div>
      </div>

      <DataTable
        columns={orderColumns}
        data={items}
        isLoading={isLoading}
        isRowClickble={false}
      />
    </div>
  );
}
