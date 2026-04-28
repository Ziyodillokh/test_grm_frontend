import DataLibraryEntityPage from "../_shared/entity-page";

export default function ColorsPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Rang", plural: "Ranglar" }}
      apiPath="/color"
    />
  );
}
