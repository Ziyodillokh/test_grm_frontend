import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbStore {
  activeMenuLink: string | null;
  items: BreadcrumbItem[];
  setMenu: (link: string, label: string) => void;
  push: (label: string, path: string) => void;
  goBack: () => BreadcrumbItem | null;
  goTo: (index: number) => BreadcrumbItem | null;
}

export const useBreadcrumbStore = create<BreadcrumbStore>()(
  persist(
    (set, get) => ({
      activeMenuLink: null,
      items: [],
      setMenu: (link, label) =>
        set({ activeMenuLink: link, items: [{ label, path: link }] }),
      push: (label, path) =>
        set((s) => ({ items: [...s.items, { label, path }] })),
      goBack: () => {
        const { items } = get();
        if (items.length <= 1) return null;
        const prev = items[items.length - 2];
        set({ items: items.slice(0, -1) });
        return prev;
      },
      goTo: (index: number) => {
        const { items } = get();
        if (index < 0 || index >= items.length) return null;
        const target = items[index];
        set({ items: items.slice(0, index + 1) });
        return target;
      },
    }),
    { name: "breadcrumb" }
  )
);
