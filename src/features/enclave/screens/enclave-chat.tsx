"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEnclaveData } from "../service/fetch.util";

interface EnclaveData {
  id: string;
  [key: string]: any;
}

export default function EnclaveChatScreen() {
  const params = useParams();
  const id = params.id as string;
  const [enclaveData, setEnclaveData] = useState<EnclaveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnclaveData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnclaveData(id);
        setEnclaveData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enclave data");
        console.error("Error loading enclave data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEnclaveData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500/30 border-t-green-500" />
          <p className="text-white">Loading enclave...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!enclaveData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <p className="text-zinc-400">No enclave data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <pre className="p-6 text-white">{JSON.stringify(enclaveData, null, 2)}</pre>
    </div>
  );
}
