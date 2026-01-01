"use client";

import { useEffect, useState } from "react";
import { clearUserToken, getUserToken } from "../service/utils";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "../service/fetch.util";
import { useMyUser } from "@/features/user";

export default function ClientGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useMyUser((state) => state.setUser);
  const setIsLogin = useMyUser((state) => state.setIsLogin);
  useEffect(() => {
    async function init() {
      try {
        let profile: null | Record<string, any> = null;
        if (getUserToken()) {
          profile = await fetchUserProfile();
          if (profile) setUser(profile);
          setIsLogin(true);
        } else {
          router.replace("/auth/create-session");
        }
      } catch (err) {
        clearUserToken();
        router.replace("/auth/create-session");
      }
    }

    init();
  }, [router, setUser]);

  return <div>{children}</div>;
}
