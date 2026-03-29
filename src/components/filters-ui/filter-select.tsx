
import { parseAsString, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import ShadcnSelect from "../Select";

interface iFilterSelect {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  classNameValue?: string;
  classNameContainer?: string;
  classNameItem?: string;
  icons?: React.ReactNode;
  disabled?: boolean
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
}: iFilterSelect) {
  const [value, setValue] = useQueryState(
    name,
    parseAsString.withDefault(defaultValue || "")
  );

  // useEffect(()=>{
  //   if(defaultValue)  setValue(defaultValue)
  // },[defaultValue])

  const { t } = useTranslation();

  return (
    <div className={`${className && className} flex items-center bg-card rounded-xl `}>
      {icons && icons}
      <ShadcnSelect
        className={` border-none bg-card rounded-sm px-4  ${className && className}`}
        disabled={disabled}
        value={value?.length ? value : undefined}
        defaultValue={defaultValue && defaultValue}
        classNameContainer={classNameContainer && classNameContainer}
        classNameValue={classNameValue && classNameValue}
        classNameItem={classNameItem && classNameItem}
        isLoading={false}
        options={
          options
            ? options
            : []
        }
        placeholder={placeholder ? t(placeholder) : "Выберите"}
        onChange={(e) => {
          if (e == "clear") {
            setValue(null)
          } else {
            setValue(e || "")
          }
        }}
      />
    </div>
  );
}
