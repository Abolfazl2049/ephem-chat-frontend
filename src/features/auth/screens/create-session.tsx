"use client";

import { useState } from "react";
import { createSession } from "../service/fetch.util";
import SessionForm from "../components/session-form";
import SessionFormResult from "../components/session-form-result";
import { useRouter } from "next/navigation";

// Token format validation - adjust regex based on your token format
const TOKEN_REGEX = /^[a-zA-Z0-9_-]+$/;

const isValidTokenFormat = (token: string): boolean => {
  return TOKEN_REGEX.test(token) && token.length > 0;
};

export default function CreateSession() {
  const [step, setStep] = useState<"input" | "token">("input");
  const [mode, setMode] = useState<"create" | "token">("create");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [persistToken, setPersistToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const nameError = Boolean(name && (name.length < 3 || name.length > 17));
  const tokenError = Boolean(token && !isValidTokenFormat(token));

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError || !name) return;

    setLoading(true);
    setError("");

    try {
      const data = await createSession(name);
      setToken(data.data.session.token);
      setStep("token");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleUseToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenError || !token) return;

    setLoading(true);
    setError("");

    try {
      // Store the token
      const storage = persistToken ? localStorage : sessionStorage;
      storage.setItem("session-token", token);

      // Redirect to home
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore session");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (mode === "create") {
      handleCreateSession(e);
    } else {
      handleUseToken(e);
    }
  };

  const handleSaveToken = async () => {
    try {
      const storage = persistToken ? localStorage : sessionStorage;
      storage.setItem("session-token", token);

      // Redirect to home
      router.replace("/");
    } catch (err) {
      setError("Failed to save token");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy token");
    }
  };

  if (step === "token") {
    return (
      <SessionFormResult
        token={token}
        persistToken={persistToken}
        setPersistToken={setPersistToken}
        onSave={handleSaveToken}
        onCopy={copyToClipboard}
        error={error}
        copied={copied}
      />
    );
  }

  return (
    <SessionForm
      mode={mode}
      setMode={setMode}
      name={name}
      setName={setName}
      nameError={nameError}
      token={token}
      setToken={setToken}
      tokenError={tokenError}
      loading={loading}
      error={error}
      onSubmit={handleFormSubmit}
    />
  );
}
