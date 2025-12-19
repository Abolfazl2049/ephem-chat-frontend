"use client";

import { useState } from "react";
import TokenForm from "../components/token-form";
import { useRouter } from "next/navigation";

// Token format validation - adjust regex based on your token format
const TOKEN_REGEX = /^[a-zA-Z0-9_-]+$/;

const isValidTokenFormat = (token: string): boolean => {
  return TOKEN_REGEX.test(token) && token.length > 0;
};

export default function RestoreTokenScreen() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const tokenError = Boolean(token && !isValidTokenFormat(token));

  const handleSubmitToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenError || !token) return;

    setLoading(true);
    setError("");

    try {
      // Store the token
      sessionStorage.setItem("token", token);

      // Redirect to home
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TokenForm
      token={token}
      setToken={setToken}
      tokenError={tokenError}
      loading={loading}
      error={error}
      onSubmit={handleSubmitToken}
    />
  );
}
