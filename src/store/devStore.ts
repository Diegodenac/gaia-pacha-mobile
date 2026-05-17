import { create } from 'zustand';

interface DevStore {
  previewAsEcoService: boolean;
  togglePreview: () => void;
}

export const useDevStore = create<DevStore>((set) => ({
  previewAsEcoService: false,
  togglePreview: () => set((s) => ({ previewAsEcoService: !s.previewAsEcoService })),
}));
