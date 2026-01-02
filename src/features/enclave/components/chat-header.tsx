"use client";

import { useState } from "react";
import { Enclave } from "../service/model";
import { ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ChatHeader({ enclave }: { enclave: Enclave }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enclave?.id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-6 py-4 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold text-white">{"Enclave"}</h1>
        <p className="text-xs text-zinc-400">ID: {enclave?.id}</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <ShareIcon className="h-4 w-4" />
            <span className="sr-only">Share Enclave</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Share Enclave</DialogTitle>
            <DialogDescription className="text-zinc-400">Copy the Enclave ID to share this chat with others.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded border border-zinc-800 bg-zinc-900 p-4">
              <code className="text-sm break-all text-zinc-100">{enclave?.id}</code>
            </div>
            <Button onClick={handleCopy} className="w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700">
              {copied ? "Copied!" : "Copy ID"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
