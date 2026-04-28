import DataLibraryEntityPage from "../_shared/entity-page";

export default function ModelsPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Model", plural: "Modellar" }}
      apiPath="/model"
      parentField={{
        name: "collection",
        label: "Kolleksiya",
        placeholder: "Kolleksiya tanlang",
        fetchUrl: "/collection",
      }}
    />
  );
}
