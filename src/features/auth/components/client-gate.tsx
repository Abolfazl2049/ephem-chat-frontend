"use client";

import { useEffect, useState } from "react";
import { clearUserToken, getUserToken } from "../service/utils";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "../service/fetch.util";
import { useMyUser } from "@/features/user";

export default function ClientGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const setUser = useMyUser((state) => state.setUser);

  useEffect(() => {
    async function init() {
      try {
        let profile: null | Record<string, any> = null;
        if (getUserToken()) {
          profile = await fetchUserProfile();
          if (profile) setUser(profile);
        } else {
          router.replace("/auth/create-session");
        }

        setReady(true);
      } catch (err) {
        clearUserToken();
        router.replace("/auth/create-session");
      }
    }

    init();
  }, [router, setUser]);

  if (!ready) {
    return null;
  }
  return <div>{children}</div>;
}
