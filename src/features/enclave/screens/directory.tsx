"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyEnclaves } from "../service/fetch.util";
import { Enclave } from "../service/model";
import { DataTemplate } from "@/features/shared";
import { useMyUser } from "@/features/user";

export default function Directory() {
  const router = useRouter();
  const [enclaves, setEnclaves] = useState<Enclave[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const isLogin = useMyUser((state) => state.isLogin);
  useEffect(() => {
    if (isLogin) {
      fetchMyEnclaves({ limit: "100" })
        .then(({ rows }) => {
          const parseRows = rows.map((r) => new Enclave(r));
          setEnclaves(parseRows);
        })
        .finally(() => setIsFetched(true));
    }
  }, [isLogin]);

  const handleNavigateToEnclave = (id: string) => {
    router.push(`/enclave/${id}`);
  };

  return (
    <div className="p-4">
      <p className="mt-2 mb-2 text-xl font-bold text-white">Enclaves</p>
      <DataTemplate
        data={enclaves}
        isFetched={isFetched}
        loadingTemplate={
          <div className="mt-4 grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 shadow-md">
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-400" />
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-300" />
                </div>
              </div>
            ))}
          </div>
        }
        emptyTemplate={
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-md rounded-lg border border-zinc-700 bg-zinc-800/50 p-8 text-center shadow-md">
              <p className="mb-2 text-xl font-semibold text-zinc-200">No Enclaves ?</p>
              <p className="text-zinc-400">You are not in any enclaves ! </p>
            </div>
          </div>
        }>
        <div className="mt-2.5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enclaves.map((enclave) => (
            <button
              key={enclave.id}
              onClick={() => handleNavigateToEnclave(enclave.id)}
              className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-left shadow-md transition-all duration-200 hover:bg-zinc-950 hover:shadow-lg">
              <div className="flex flex-col gap-1">
                <p className="truncate text-sm text-zinc-400">UUID: {enclave.id}</p>
                <p className="text-base font-medium text-zinc-300">Expires: {new Date(enclave.expiresAt).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
      </DataTemplate>
    </div>
  );
}
