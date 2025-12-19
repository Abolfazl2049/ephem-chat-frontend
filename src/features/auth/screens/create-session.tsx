"use client";

import { useState } from "react";
import { createSession } from "../service/fetch.util";
import SessionForm from "../components/session-form";
import SessionFormResult from "../components/session-form-result";
import { useRouter } from "next/navigation";

export default function CreateSession() {
  const [step, setStep] = useState<"input" | "token">("input");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [persistToken, setPersistToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const nameError = Boolean(name && (name.length < 3 || name.length > 17));

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

  const handleSaveToken = async () => {
    try {
      const storage = persistToken ? localStorage : sessionStorage;
      storage.setItem("session-token", token);

      // Set cookie as well for middleware
      cookieStore.set("session-token", token).then((res) => {
        router.replace("/");
      });

      // Redirect to home
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
      name={name}
      setName={setName}
      nameError={nameError as boolean}
      loading={loading}
      error={error}
      onSubmit={handleCreateSession}
    />
  );
}
