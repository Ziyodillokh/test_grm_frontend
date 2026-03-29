
import BarcodeQenerat from "@/components/barcode-generat";
import FormTextInput from "@/components/forms/FormTextInput";
import Teminal from "@/components/teminal";

import Filters from "./filters";

export default function ProductsCheckFormContent() {
  return (
    <div className="w-full flex ">
      <div className="w-full">
        <Filters />
        <div className="grid row-start  px-[40px] py-[20px] gap-2 lg:grid-cols-3">
          <FormTextInput
            classNameInput="h-[28px]  p-2"
            name="code"
            placeholder="Штрих-код"
            label="Штрих-код"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            name="collection"
            placeholder="Коллекция"
            label="Коллекция"
            readOnly
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="model"
            placeholder="Модель"
            label="Модель"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="size"
            placeholder="Размер"
            label="Размер"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="type"
            placeholder="Тип ковра"
            label="Тип ковра"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="shape"
            placeholder="Форма"
            label="Форма"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="color"
            placeholder="Цвет"
            label="Цвет"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="style"
            placeholder="Стиль"
            label="Стиль"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="count"
            placeholder="Количество"
            label="Количество"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="country"
            placeholder="Страна"
            label="Страна"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="Поставщик"
            placeholder="Поставщик"
            label="Поставщик"
          />
          <FormTextInput
            classNameInput="h-[28px] p-2"
            readOnly
            name="Партия"
            placeholder="Партия"
            label="Партия"
          />
        </div>
        <BarcodeQenerat />
      </div>
      <Teminal title="Исходные данные и история продукта" />
    </div>
  );
}
