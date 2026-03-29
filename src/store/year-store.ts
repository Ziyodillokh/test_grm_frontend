import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Year {
  year: number ;
  setYear: (year: number) => void;
  removeYear: () => void;
}

const currentYear = new Date().getFullYear();
export const useYear = create<Year>()(
  persist(
    (set) => ({
      year: currentYear,
      setYear: (year) => set({ year }),
      removeYear: () => set({ year: currentYear }),
    }),
    { name: "Year-storage" } 
  )
);
