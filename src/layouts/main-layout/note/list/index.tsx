import { StickyNote } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

import { TData } from "../types";
import Content from "./content";
import useDataFetch from "./queries";

export default function NotePage() {
  const [active, setActive] = useState(false);
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const { data } = useDataFetch({
    queries: { limit, page },
  });

  const flatData = (data?.pages?.[0].items || []) as unknown as TData[];

  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    }

    if (active) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [active]);

  return (
    <div
      ref={noteRef}
      className=" mx-auto text-center flex my-5 items-center justify-center  cursor-pointer z-20"
    >
      <StickyNote
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
        className="w-5 h-5"
      />
      {active && (
        <div className="absolute bottom-8 py-[14px] px-5 left-16  z-1000 bg-card rounded-[12px] border w-[380px]  max-h-[600px] ">
          <Content data={flatData} />
        </div>
      )}
    </div>
  );
}
