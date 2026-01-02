import Link from "next/link";

export default function AppNavbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-white">
          EphemChat
        </Link>
      </div>
    </nav>
  );
}
