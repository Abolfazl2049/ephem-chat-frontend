"use client";

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
        <div className="space-y-4">
          <div className="border-t border-zinc-800 pt-4">
            <div className="h-4 w-8 animate-pulse rounded bg-zinc-400" />
            <div className="mt-1 h-5 w-24 animate-pulse rounded bg-zinc-300" />
          </div>
          <div className="h-10 w-full animate-pulse rounded bg-zinc-800" />
        </div>
      }>
      <div className="space-y-4">
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-sm text-zinc-400">User</p>
          <p className="text-base font-medium text-white">{user?.name || "Guest"}</p>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Logout
        </Button>
      </div>
    </DataTemplate>
  );
}
