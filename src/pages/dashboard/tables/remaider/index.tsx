import { JSX, useState } from "react";
import CountryRemainderTable from "./country";
import FoctoryRemainderTable from "./factory";
import CollectionTable from "./collection";
import ModelTable from "./model";
import SizeTable from "./size";
export interface IRemainderTable 
{
  name: string;
  countryId?: string;
  factoryId?: string;
  collectionId?: string;
  modelId?:string;
}

export default function RemainderTable() {
  const [remainder, setRemainder] = useState<IRemainderTable>({
    name: "country",
    countryId:"",
    factoryId: "",
    collectionId: "",
    modelId:""
  });

  // Mapping table names to components
  const remainderTable: Record<string, JSX.Element> = {
    country: (
      <CountryRemainderTable
        remainder={remainder}
        setRemainder={setRemainder}
      />
    ),
    factory: (
      <FoctoryRemainderTable
        remainder={remainder}
        setRemainder={setRemainder}
      />
    ),
    collection: (
      <CollectionTable remainder={remainder} setRemainder={setRemainder} />
    ),
    model: (
      <ModelTable remainder={remainder} setRemainder={setRemainder} />
    ),
    size: (
      <SizeTable remainder={remainder} setRemainder={setRemainder} />
    ),
  };


  return <>{remainderTable?.[remainder.name]}</>;
}
