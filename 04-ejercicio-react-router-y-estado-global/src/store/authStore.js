import { create } from "zustand";

export const useAuthStore = create((set) => ({
  username: null,
  isLoggedIn: false,
  login: (username) =>
    set({
      username,
      isLoggedIn: username !== null,
    }),
  logout: () =>
    set({
      username: null,
      isLoggedIn: false,
    }),
}));
