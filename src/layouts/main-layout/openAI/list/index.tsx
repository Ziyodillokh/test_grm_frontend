// import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

import { OpenAIIcons } from "@/components/icons";

// import { TData } from "../types";
import Content from "./content";
// import useDataFetch from "./queries";

export default function OpenAI() {
  const [active, setActive] = useState(false);
  // const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  // const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  // const { data } = useDataFetch({
  //   queries: {
  //     limit,
  //     page,
  //   },
  // });

  // const flatData = (data?.pages?.[0].items || []) as unknown as TData[];
  return (
    <div className="relative">
      <div onClick={() => setActive(!active)}>
        <div
          className={`bg-[#272727] border-transparent cursor-pointer text-center flex items-center justify-center p-[20px]`}
        >
          <OpenAIIcons />
        </div>
      </div>
      {active && (
        <div className="absolute bottom-8  left-30 bg-card rounded-[12px] border w-[835px] h-[700px] overflow-hidden shadow-[0px_34px_44px_0px_rgba(65,55,23,0.06)] ">
          <Content />
        </div>
      )}
    </div>
  );
}
