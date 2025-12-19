"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokenFormProps {
  token: string;
  setToken: (value: string) => void;
  tokenError: boolean;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TokenForm({
  token,
  setToken,
  tokenError,
  loading,
  error,
  onSubmit,
}: TokenFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">EphemChat</h1>
          <p className="mt-1 text-sm text-neutral-500">Restore Your Session</p>
        </div>

        {/* Token Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Token Input */}
          <div className="space-y-2">
            <Label htmlFor="token">Session Token</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your saved token"
              autoFocus
              className={tokenError ? "border-red-800 bg-red-950 focus:border-red-700" : ""}
            />
            {tokenError && <p className="text-xs text-red-400">Invalid token format</p>}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={tokenError || !token || loading}
            className="w-full"
            variant={error ? "destructive" : "default"}>
            {loading ? "Restoring Session..." : "Restore Session"}
          </Button>
        </form>

        {/* Info Box */}
        <div className="space-y-2 rounded border border-neutral-800 bg-neutral-900 px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">About Tokens</p>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Your token gives you access to your session</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Keep it safe and secure</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Sessions expire automatically</span>
            </li>
          </ul>
        </div>

        {/* Footer with Link */}
        <div className="space-y-3 text-center">
          <p className="text-xs text-neutral-600">Your data is ephemeral. Chats are temporary.</p>
          <Link href="/auth/create-session" className="inline-block text-xs text-neutral-400 hover:text-neutral-300 underline underline-offset-2 transition-colors">
            Create a new session instead
          </Link>
        </div>
      </div>
    </div>
  );
}
