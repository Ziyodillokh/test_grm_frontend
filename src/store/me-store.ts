import { create } from "zustand";
import { persist } from "zustand/middleware";

import { IUserData } from "@/types";


interface MeState {
  meUser: IUserData | null;
  setUserMe: (meUser: IUserData) => void;
  removeUserMe: () => void;
}

export const useMeStore = create<MeState>()(
  persist(
    (set) => ({
      meUser: null,
      setUserMe: (meUser) => set({ meUser }),
      removeUserMe: () => set({ meUser: null }),
    }),
    { name: "userMe-storage" } // Key for localStorage
  )
);
