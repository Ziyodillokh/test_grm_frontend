// types.ts
export type MonitoringItem = {
    id: string;
    type: 'bonus' | 'salary' | 'premium';
    amount: number;
    condition?: string;
    details: string;
    dateTime: string;
    employee: {
      id: string;
      name: string;
      avatar?: string;
    };
    manager: {
      id: string;
      name: string;
      avatar?: string;
    };
    status: 'Принять' | 'Принято' | 'В ожидании';
  };
  
  export type MonitoringSummary = {
    total: number;
    plastic: number;
    cash: number;
    bonus: number;
    premium: number;
    advance: number;
    date: string;
  };
  
  export type MonitoringQuery = {
    employeeId?: string;
    filialId?: string;
    type?: string;
  };