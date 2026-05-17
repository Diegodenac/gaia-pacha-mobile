import { create } from 'zustand';

interface EcoServiceStore {
  activeEcoServiceId: string | null;
  setActiveEcoServiceId: (id: string) => void;
}

/**
 * EcoService Store — tracks which enterprise is currently active.
 * Used by the Profile switcher and Products tab to scope data fetches.
 * No persistence — resets on app reload (selection re-derives from the list).
 */
export const useEcoServiceStore = create<EcoServiceStore>((set) => ({
  activeEcoServiceId: null,
  setActiveEcoServiceId: (id) => set({ activeEcoServiceId: id }),
}));
