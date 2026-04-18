import { create } from "zustand";

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
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set, get) => ({
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
}));
