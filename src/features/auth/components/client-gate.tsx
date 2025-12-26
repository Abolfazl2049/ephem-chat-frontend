"use client";

import { useEffect, useState } from "react";
import { clearUserToken, getUserToken } from "../service/utils";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getRouteConfig } from "@/configs/routes";
import { fetchUserProfile } from "../service/fetch.util";

export default function ClientGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeConfig = getRouteConfig(pathname);

  useEffect(() => {
    async function init() {
      try {
        let profile: null | Record<string, null> = null;

        if (routeConfig.requiresAuth) {
          if (getUserToken()) {
            profile = await fetchUserProfile();
            console.log("profile", profile);
          } else {
            router.replace("/auth/create-session");
          }
        }

        setReady(true);
      } catch (err) {
        if (routeConfig.requiresAuth) {
          clearUserToken();
          router.replace("/auth/create-session");
        }
      }
    }

    init();
  }, [routeConfig.requiresAuth, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
