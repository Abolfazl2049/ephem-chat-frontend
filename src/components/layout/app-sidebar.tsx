import { UserSidebarActions } from "@/features/user";

export default function AppSidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/30 p-6">
      <div className="space-y-6">
        <UserSidebarActions />
      </div>
    </aside>
  );
}
