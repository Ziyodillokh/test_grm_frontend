// import {Conent} from "./conent";
import LeftConent from "./left-conent";
import RightConent from "./right-conent";

import { useRef } from "react";
import { Conent } from "./conent";

export default function PageOrginalCopy() {


  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div    className="flex h-[calc(100vh-65px)]">
        <LeftConent  />
        <Conent ref={printRef}/>
        <RightConent printRef={printRef}/>
      </div>
  );
}
