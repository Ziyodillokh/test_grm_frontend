import DataLibraryEntityPage from "../_shared/entity-page";

export default function ShapesPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Shakl", plural: "Shakllar" }}
      apiPath="/shape"
    />
  );
}
