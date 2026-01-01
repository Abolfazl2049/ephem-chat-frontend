"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyEnclaves } from "../service/fetch.util";
import { Enclave } from "../service/model";
import { DataTemplate } from "@/features/shared";

export default function MyEnclavesSidebar() {
  const router = useRouter();
  const [enclaves, setEnclaves] = useState<Enclave[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    fetchMyEnclaves()
      .then(({ rows }) => {
        const parseRows = rows.map((r) => new Enclave(r));
        setEnclaves(parseRows);
      })
      .finally(() => setIsFetched(true));
  }, []);

  const handleNavigateToEnclave = (id: string) => {
    router.push(`/enclave/${id}`);
  };

  return (
    <DataTemplate data={enclaves} isFetched={isFetched}>
      <div className="mt-4 flex flex-col gap-2">
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
