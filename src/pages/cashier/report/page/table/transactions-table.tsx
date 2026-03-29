import { KassaReportData } from "../../type";
import formatPrice from "@/utils/formatPrice";
import { DataTable } from "@/components/ui/data-table";
import { getTransactionColumns, TransactionData } from "./transaction-table-column";

interface TransactionsTableProps {
  report: KassaReportData | undefined;
}

export default function TransactionsTable({ report }: TransactionsTableProps) {
  if (!report) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Нет данных для отображения. Выберите другую дату или проверьте наличие отчетов.
      </div>
    );
  }

  // Create table data from report
  const tableData: TransactionData[] = [
    { 
      id: 1, 
      date: "Продалажется", 
      sum: `${formatPrice(report.income)} $`, 
      terminal: `${formatPrice(report.plasticSum)} $`, 
      discount: `${formatPrice(report.expenditureShop)} $`, 
      navar: "278$", 
      volume: `${report.totalSize} м²`, 
      income: `${formatPrice(report.income)} $`, 
      expense: `-${formatPrice(report.expense)} $`, 
      inkassation: formatPrice(report.cashFlowSumBoss),
      isFirstRow: true 
    },
    ...(report.cashflowAndOrders || []).slice(0, 8).map((_item, index) => {
      return {
        id: index + 2,
        date: "10 Март 2025",
        sum: "189 $",
        terminal: "0 $",
        discount: "0 $",
        navar: "278$",
        volume: "432 м²",
        income: "0 $",
        expense: "-90 $",
        inkassation: "1350.00"
      };
    })
  ];

  // We generate some placeholder data if we don't have enough rows
  if (tableData.length < 3) {
    for (let i = tableData.length; i < 5; i++) {
      tableData.push({
        id: i + 10,
        date: "10 Март 2025",
        sum: "189 $",
        terminal: "0 $",
        discount: "0 $",
        navar: "278$",
        volume: "432 м²",
        income: "0 $",
        expense: "-90 $",
        inkassation: "1350.00"
      });
    }
  }

  const columns = getTransactionColumns();
  
  return (
    <div className="bg-white border rounded">
      <DataTable 
        columns={columns} 
        data={tableData} 
        isLoading={false}
        className="rounded-none border-none"
        isRowClickble={true}
      />
    </div>
  );
}