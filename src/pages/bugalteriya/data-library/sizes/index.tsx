import DataLibraryEntityPage from "../_shared/entity-page";

export default function SizesPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "O'lcham", plural: "O'lchamlar" }}
      apiPath="/size"
    />
  );
}
