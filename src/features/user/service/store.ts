import { create } from "zustand";
import { User } from "./model";

interface UserState {
  data: null | User;
  setUser: (data: Record<string, any>) => void;
}

export const useMyUser = create<UserState>((set) => ({
  data: null as null | User,
  setUser: (data: Record<string, any>) => {
    set({ data: new User(data) });
  },
}));
