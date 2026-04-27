import { create } from "zustand";

interface EditPartiyaProductStore {
  // Tahrirlash uchun tanlangan mahsulot ma'lumotlari (re-register list rowidan)
  product: any | null;
  setProduct: (p: any | null) => void;
}

export const useEditPartiyaProductStore = create<EditPartiyaProductStore>((set) => ({
  product: null,
  setProduct: (p) => set({ product: p }),
}));
