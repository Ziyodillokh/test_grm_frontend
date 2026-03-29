import { useTranslation } from "react-i18next";

import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";
import FormDatePicker from "@/components/forms/FormDateRangePicker";
import FormSelectInput from "@/components/forms/FormSelect";
import FormTextArea from "@/components/forms/FormTextArea";
import { TCropCategory } from "../type";
import { useNavigate, useParams } from "react-router-dom";
import FormSwitch from "@/components/forms/FormSwitch";
import FormFileUpload from "@/components/forms/FormFileUpload";

export default function CropFormContent() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 rounded-sm my-4 ">
      <h3 className="text-3xl font-semibold mb-4">
        {id ? t("add") : t("update")}
      </h3>

      <div className="grid row-start  gap-4 lg:grid-cols-2">
        <FormFileUpload
          name="main_image"
          folder="crops"
          className="col-span-2 max-w-[300px]"
          acceptTypes="image/*"
          label="upload"
          text="text"
        />
        <FormTextInput name="name" placeholder="name" label="name" />
        <FormTextInput
          name="biology_name"
          placeholder="biologyName"
          label="biologyName"
        />
        <FormDatePicker
          name="planting_time_start"
          placeholder="plantingTimeStart"
          label="plantingTimeStart"
        />
        <FormDatePicker
          name="planting_time_end"
          placeholder="plantingTimeEnd"
          label="plantingTimeEnd"
        />
        <FormTextInput
          name="crop_code"
          placeholder="cropCode"
          label="cropCode"
        />
        <FormTextInput
          name="harvest_duration"
          placeholder="harvestduration"
          label="harvestDuration"
          type="number"
        />
        <FormSelectInput<TCropCategory, {}>
          fieldNames={{ value: "id", label: "name" }}
          fetchUrl="/crop-categories"
          name="crop_category"
          placeholder="cropCategory"
          label="cropcategory"
        />
        <FormSwitch label="doCommon" name="is_common" />
        <FormTextArea
          className="w-full col-span-2"
          name="description"
          placeholder="description"
          label="description"
        />
        <Button onClick={() => navigate(-1)} type="button" variant={"outline"}>
          {t("goBack")}
        </Button>
        <Button type="submit">{t("login")}</Button>
      </div>
    </div>
  );
}
