import DataLibraryEntityPage from "../_shared/entity-page";

export default function FactoriesPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Taminotchi", plural: "Taminotchilar" }}
      apiPath="/factory"
      parentField={{
        name: "country",
        label: "Davlat",
        placeholder: "Davlat tanlang",
        fetchUrl: "/country",
      }}
    />
  );
}
