import DataLibraryEntityPage from "../_shared/entity-page";

export default function StylesPage() {
  return (
    <DataLibraryEntityPage
      labels={{ single: "Uslubiyat", plural: "Uslubiyatlar" }}
      apiPath="/style"
    />
  );
}
