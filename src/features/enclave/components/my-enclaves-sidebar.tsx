"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyEnclaves } from "../service/fetch.util";
import { Enclave } from "../service/model";
import { DataTemplate } from "@/features/shared";
import { useMyUser } from "@/features/user";

export default function MyEnclavesSidebar({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const [enclaves, setEnclaves] = useState<Enclave[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const isLogin = useMyUser((state) => state.isLogin);
  useEffect(() => {
    if (isLogin) {
      fetchMyEnclaves({ limit: "5" })
        .then(({ rows }) => {
          const parseRows = rows.map((r) => new Enclave(r));
          setEnclaves(parseRows);
        })
        .finally(() => setIsFetched(true));
    }
  }, [isLogin]);

  const handleNavigateToEnclave = (id: string) => {
    router.push(`/enclave/${id}`);
    onNavigate();
  };

  return (
    <DataTemplate
      data={enclaves}
      isFetched={isFetched}
      loadingTemplate={
        <div className="mt-4 flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="flex flex-col gap-1">
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-400" />
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      }>
      <p className="mt-4 font-semibold text-white">Enclaves</p>
      <div className="mt-2.5 flex flex-col gap-2">
        {enclaves.map((enclave) => (
          <button
            key={enclave.id}
            onClick={() => handleNavigateToEnclave(enclave.id)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-left transition-colors hover:bg-zinc-800">
            <div className="flex flex-col gap-1">
              <p className="truncate text-xs text-zinc-400">UUID: {enclave.id}</p>
              <p className="text-sm font-medium text-zinc-300">Expires: {new Date(enclave.expiresAt).toLocaleDateString()}</p>
            </div>
          </button>
        ))}
      </div>
    </DataTemplate>
  );
}
