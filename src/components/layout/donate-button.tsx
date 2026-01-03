"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const address = "0xe687d642fa7a82e490e060537afe8d60d90cd357";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transform gap-1.5! rounded-full bg-gradient-to-r from-pink-500 to-red-500 py-2 pr-3.5! pl-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-red-600">
          <Icon icon="tabler:heart" className="size-4.5!" />
          <p className="relative bottom-0.5 hidden md:block">Donate</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Support Us</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Your support helps us keep EphemChat running. Donate via Tether (USDT) on the Polygon network.
          </p>
          <div className="rounded-md bg-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <p className="flex-1 font-mono text-sm break-all text-zinc-100">
                Wallet Address: <br /> {address}
              </p>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="default"
                className="ml-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                <Icon icon={copied ? "tabler:check" : "tabler:copy"} />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Network: Polygon
              <br />
              Token: USDT (Tether)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
