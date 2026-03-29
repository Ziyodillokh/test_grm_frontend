import {  Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import debounce from "@/utils/debounce";

import { Input } from "../ui/input";

export default function SearchInput({ className }: { className?: string }) {
  const [search, setSearch] = useQueryState("search");
  const { t } = useTranslation();
  return (
    <div
      className={`${className && className} flex bg-card  rounded-xl items-center px-4 gap-[15px]`}
    >
      <Search size={20} />
      <Input
        onChange={debounce((e) => {
          setSearch(e.target.value);
        }, 500)}
        defaultValue={search || ""}
        className="bg-transparent p-0  border-none"
        placeholder={t("search")}
      />
      {/* <Loader size={16} /> */}
    </div>
  );
}
