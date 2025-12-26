"use client";

import AppNavbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/app-sidebar";
import SearchTrigger from "@/features/matching/components/search-triggert";
import HomeUuidInput from "@/features/enclave/components/home-uuid-input";
import HomeLink from "@/features/enclave/components/home-link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleUuidSubmit = (uuid: string) => {
    // Navigate to enclave with UUID
    router.push(`/enclave/${uuid}`);
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Search Section */}
        <div className="space-y-6">
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-2xl font-bold text-white">Find Your Enclave</h2>
            <p className="text-zinc-400">Connect with others in your secure space</p>
          </div>

          <SearchTrigger />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-zinc-500">or</span>
          </div>
        </div>

        {/* UUID Input Section */}
        <div className="space-y-4">
          <HomeUuidInput onSubmit={handleUuidSubmit} />
        </div>

        {/* My Enclaves Link */}
        <HomeLink />
      </div>
    </div>
  );
}
