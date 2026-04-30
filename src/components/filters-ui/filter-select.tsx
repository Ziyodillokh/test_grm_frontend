
import { parseAsString, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import ShadcnSelect from "../Select";
import { FILTER_INPUT_TRIGGER, FILTER_INPUT_PLACEHOLDER } from "./filter-input";

interface iFilterSelect {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  classNameValue?: string;
  classNameContainer?: string;
  classNameItem?: string;
  icons?: React.ReactNode;
  disabled?: boolean;
  /** "filter" — popover ichidagi filter input style (h-44, border-b only, bg-white, rounded-[4px]). */
  variant?: "default" | "filter";
  options?: {
    label: string;
    value: string | undefined;
  }[];
}
export default function FilterSelect({
  name,
  icons,
  placeholder,
  className,
  classNameItem,
  defaultValue,
  classNameContainer,
  options,
  disabled,
  classNameValue,
  variant = "default",
}: iFilterSelect) {
  const [value, setValue] = useQueryState(
    name,
    parseAsString.withDefault(defaultValue || "")
  );

  const { t } = useTranslation();

  const isFilter = variant === "filter";
  const triggerClass = isFilter
    ? `${FILTER_INPUT_TRIGGER} data-[placeholder]:!text-[#0078d4] [&>span]:flex-1 [&>span]:text-left [&>span]:truncate [&>svg]:absolute [&>svg]:right-3 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:!text-[#1a1a1a] [&>svg]:!mix-blend-normal`
    : ` border-none bg-card rounded-sm px-4  ${className && className}`;

  return (
    <div className={isFilter ? "w-full" : `${className && className} flex items-center bg-card rounded-sm `}>
      {icons && icons}
      <ShadcnSelect
        className={triggerClass}
        disabled={disabled}
        value={value?.length ? value : undefined}
        defaultValue={defaultValue && defaultValue}
        classNameContainer={classNameContainer && classNameContainer}
        classNameValue={isFilter ? `${classNameValue || ""} ${FILTER_INPUT_PLACEHOLDER}` : classNameValue}
        classNameItem={classNameItem && classNameItem}
        isLoading={false}
        options={options ? options : []}
        placeholder={placeholder ? t(placeholder) : "Выберите"}
        onChange={(e) => {
          if (e == "clear") {
            setValue(null);
          } else {
            setValue(e || "");
          }
        }}
      />
    </div>
  );
}
