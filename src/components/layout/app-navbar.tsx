"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface AppNavbarProps {
  onToggleSidebar: () => void;
}

export default function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 py-3.5 md:px-6 md:py-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-md transition-colors hover:bg-zinc-800 md:hidden"
          aria-label="Toggle sidebar">
          <Icon icon="tabler:layout-sidebar-right-collapse" className="text-xl text-zinc-200" />
        </button>
        <Link href="/" className="text-xl font-semibold text-white">
          EphemChat
        </Link>
        <div></div> {/* Spacer for centering */}
      </div>
    </nav>
  );
}
