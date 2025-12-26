"use client";

import { useRouter } from "next/navigation";
import { useMyUser } from "../service/store";
import { Button } from "@/components/ui/button";

export default function SidebarActions() {
  const router = useRouter();
  const user = useMyUser((state) => state.data);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.replace("/auth/create-session");
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-zinc-800 pt-4">
        <p className="text-sm text-zinc-400">User</p>
        <p className="text-base font-medium text-white">{user?.name || "Guest"}</p>
      </div>
      <Button onClick={handleLogout} variant="destructive" className="w-full">
        Logout
      </Button>
    </div>
  );
}
