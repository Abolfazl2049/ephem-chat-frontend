"use client";
import { MyEnclavesSidebar } from "@/features/enclave";
import { UserSidebarActions } from "@/features/user";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-zinc-950 p-6 pt-5 transition-transform duration-200 md:relative md:z-auto md:translate-x-0 md:bg-zinc-950/30 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="space-y-6">
        <UserSidebarActions />
      </div>
      <MyEnclavesSidebar onNavigate={onClose} />
    </aside>
  );
}
