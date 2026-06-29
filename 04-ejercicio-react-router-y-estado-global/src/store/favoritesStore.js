import { create } from "zustand";

export const useFavoritesStore = create((set, get) => ({
  favorites: [],

  addFavorite: (jobID) =>
    set((state) => {
      if (state.favorites.includes(jobID)) return state;

      return { favorites: [...state.favorites, jobID] };
    }),

  removeFavorite: (jobID) =>
    set((state) => ({
      favorites: state.favorites.filter((favID) => favID !== jobID),
    })),

  toggleFavorite: (jobID) =>
    set((state) => ({
      favorites: state.favorites.includes(jobID)
        ? state.favorites.filter((favID) => favID !== jobID)
        : [...state.favorites, jobID],
    })),

  isFavorite: (jobID) => get().favorites.includes(jobID),

  clearFavorites: () => set({ favorites: [] }),
}));
