"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useMyUser } from "../service/store";
import { Button } from "@/components/ui/button";
import { DataTemplate } from "@/features/shared";

export default function SidebarActions() {
  const router = useRouter();
  const user = useMyUser((state) => state.data);
  const onLogout = useMyUser((state) => state.onLogout);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onLogout();
    router.replace("/auth/create-session");
  };

  return (
    <DataTemplate
      data={user}
      isFetched={false}
      loadingTemplate={
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-400" />
              <div className="space-y-1">
                <div className="h-3 w-12 animate-pulse rounded bg-zinc-400" />
                <div className="h-4 w-20 animate-pulse rounded bg-zinc-300" />
              </div>
            </div>
            <div className="h-10 w-full animate-pulse rounded bg-zinc-700" />
          </div>
        </div>
      }>
      <div className="rounded-lg border border-zinc-700 p-4 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Icon icon="mdi:account-circle" className="h-8 w-8 text-zinc-400" />
            <div>
              <p className="text-xs tracking-wide text-zinc-500 uppercase">User</p>
              <p className="text-base font-semibold text-white">{user?.name || "Guest"}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="flex w-full items-center justify-center">
            <Icon icon="mdi:logout" className="h-4 w-4 -scale-x-100" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </DataTemplate>
  );
}
