import DataLibraryEntityPage from "../_shared/entity-page";

export default function CollectionsPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Kolleksiya", plural: "Kolleksiyalar" }}
      apiPath="/collection"
      parentField={{
        name: "factory",
        label: "Taminotchi",
        placeholder: "Taminotchi tanlang",
        fetchUrl: "/factory",
      }}
    />
  );
}
