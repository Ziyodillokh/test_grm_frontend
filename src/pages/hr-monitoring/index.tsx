// monitoring/index.tsx
import { FileOutput, Plus } from "lucide-react";
// import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

import CardSort from "@/components/card-sort";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MonitoringColumns } from "./columns";
import { mockEmployees, mockFilials, monitoringTypes } from "./mock-data";
import { useMonitoringItems } from "./queries";

export default function MonitoringDashboard() {
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [filialId, setFilialId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  
  
  const { data: monitoringData, isLoading } = useMonitoringItems({
    employeeId,
    type
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-sidebar border-border border-b px-6 h-[64px] flex items-center">
        <Select value={filialId} onValueChange={setFilialId}>
          <SelectTrigger className="w-[200px] h-9 mr-2">
            <SelectValue placeholder="Филиалы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все филиалы</SelectItem>
            {mockFilials.map(filial => (
              <SelectItem key={filial.id} value={filial.id}>
                {filial.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={employeeId} onValueChange={setEmployeeId}>
          <SelectTrigger className="w-[200px] h-9 mr-2">
            <SelectValue placeholder="Выберите сотрудника" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все сотрудники</SelectItem>
            {mockEmployees.map(employee => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[200px] h-9 mr-auto">
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            {monitoringTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="ml-auto">
          <FileOutput className="mr-2 h-4 w-4" /> Экспорт
        </Button>
        
        <Button className="ml-2">
          <Plus className="mr-2 h-4 w-4" /> Добавить ведомость
        </Button>
      </div>
      
      <CardSort KassaId=""/>
      
      {/* Data Table */}
      <div className="mx-4 mb-4 flex-1">
        <DataTable
          columns={MonitoringColumns()}
          data={monitoringData?.pages.flatMap(page => page.items) ?? []}
          isLoading={isLoading}
        //   fetchNextPage={fetchNextPage}
        //   hasNextPage={hasNextPage ?? false}
        //   isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}