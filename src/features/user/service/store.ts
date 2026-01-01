import { create } from "zustand";
import { User } from "./model";

interface UserState {
  data: null | User;
  isLogin: boolean;
  setUser: (data: Record<string, any>) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const useMyUser = create<UserState>((set) => ({
  data: null as null | User,
  isLogin: false,
  setUser: (data: Record<string, any>) => {
    set({ data: new User(data) });
  },
  setIsLogin(isLogin) {
    set({ isLogin });
  },
}));
