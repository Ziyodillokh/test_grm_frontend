import { useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

import { QrLogoColumns } from "./columns";
import { useQrLogoData } from "./queries";
import QrLogoModal from "../components/qr-logo-modal";

export default function QrLogoPage() {
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQrLogoData({
      queries: { limit, page },
    });

  const flatData = data?.pages?.flatMap((p) => p?.items || []) || [];

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-medium">QR Логотип</h2>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-[#89A143] hover:bg-[#7a9139] gap-1"
        >
          <Plus className="h-4 w-4" />
          Добавить QR логотип
        </Button>
      </div>

      <DataTable
        isLoading={isLoading}
        columns={QrLogoColumns}
        data={flatData}
        className="mt-2"
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />

      <QrLogoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
