"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionStepOneFormProps {
  mode: "create" | "token";
  setMode: (mode: "create" | "token") => void;
  name: string;
  setName: (value: string) => void;
  nameError: boolean;
  token: string;
  setToken: (value: string) => void;
  tokenError: boolean;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SessionForm({
  mode,
  setMode,
  name,
  setName,
  nameError,
  token,
  setToken,
  tokenError,
  loading,
  error,
  onSubmit,
}: SessionStepOneFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">EphemChat</h1>
          <p className="mt-1 text-sm text-neutral-500">Anonymous Chat</p>
        </div>

        {/* Mode Toggle using Tabs */}
        <Tabs value={mode} onValueChange={(value) => setMode(value as "create" | "token")}>
          <TabsList className="w-full">
            <TabsTrigger value="create" className="flex-1">
              New Session
            </TabsTrigger>
            <TabsTrigger value="token" className="flex-1">
              Use Token
            </TabsTrigger>
          </TabsList>

          {/* Create Session Tab */}
          <TabsContent value="create">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={17}
                  autoFocus
                  className={nameError ? "border-red-800 bg-red-950 focus:border-red-700" : ""}
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{nameError ? "Name must be 3-17 characters" : "3 to 17 characters"}</span>
                  <span>{name.length}/17</span>
                </div>
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
                disabled={nameError || !name || loading}
                className="w-full"
                variant={error ? "destructive" : "default"}>
                {loading ? "Creating Session..." : "Create Session"}
              </Button>
            </form>
          </TabsContent>

          {/* Use Token Tab */}
          <TabsContent value="token">
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
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <div className="space-y-2 rounded border border-neutral-800 bg-neutral-900 px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">How it works</p>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Create a session with your name</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Save your token to access later</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600">→</span>
              <span>Start chatting anonymously</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600">Your data is ephemeral. Chats are temporary.</p>
      </div>
    </div>
  );
}
