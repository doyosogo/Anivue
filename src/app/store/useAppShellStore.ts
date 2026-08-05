import { create } from 'zustand';

type AppShellState = {
  isMobileNavOpen: boolean;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
};

export const useAppShellStore = create<AppShellState>((set) => ({
  isMobileNavOpen: false,
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
}));
