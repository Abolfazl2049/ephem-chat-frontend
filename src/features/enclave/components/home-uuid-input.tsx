"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HomeUuidInputProps {
  onSubmit?: (uuid: string) => void;
}

export default function HomeUuidInput({ onSubmit }: HomeUuidInputProps) {
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uuid.trim()) {
      setError("Please enter an enclave UUID");
      return;
    }

    setError("");
    if (onSubmit) {
      onSubmit(uuid);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">Enclave UUID</label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter enclave UUID..."
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="border-zinc-700 bg-zinc-900/50 placeholder:text-zinc-500"
        />
        <Button type="submit" variant="outline" className="whitespace-nowrap">
          Join
        </Button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
