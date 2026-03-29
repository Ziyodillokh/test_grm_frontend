export interface TData {
    title:string;
    color:string;
    id:string;
    updated_at:Date;
  }
  
    export type TQuery = {
      search?: string | undefined;
      limit:number,
      page:number
      type?:string;
      filialId?:string
    };
    