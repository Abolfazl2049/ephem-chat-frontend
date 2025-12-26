"use client";

import { useEffect, useState } from "react";
import { clearUserToken, getUserToken } from "../service/utils";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "../service/fetch.util";

export default function ClientGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        let profile: null | Record<string, null> = null;

        if (getUserToken()) {
          profile = await fetchUserProfile();
          console.log("profile", profile);
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
  }, [router]);

  if (!ready) {
    return null;
  }

  return <div>sss{children}</div>;
}
