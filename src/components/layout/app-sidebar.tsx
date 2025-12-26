import SidebarActions from "@/features/user/components/sidebar-actions";

export default function AppSidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/30 p-6">
      <div className="space-y-6">
        <SidebarActions />
      </div>
    </aside>
  );
}
