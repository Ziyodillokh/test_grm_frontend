import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <Construction className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Tez kunda ishga tushadi
      </h2>
      <p className="text-muted-foreground max-w-md">
        Bu hisobot hozirda ishlab chiqilmoqda. Tez orada tayyor bo'ladi.
      </p>
    </div>
  );
}
