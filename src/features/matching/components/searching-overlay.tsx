"use client";

import { useState, useEffect, useRef } from "react";
import { startMatchingSocket } from "../service/socket";
import { useMyUser } from "@/features/user";
import { useRouter } from "next/navigation";

type SearchStatus = "connecting" | "searching" | "match_found" | "error";

interface SearchingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchingOverlay({ isOpen, onClose }: SearchingOverlayProps) {
  const [status, setStatus] = useState<SearchStatus>("connecting");
  const [notification, setNotification] = useState<string | null>(null);
  const connectionRef = useRef<ReturnType<typeof startMatchingSocket> | null>(null);
  const user = useMyUser((state) => state.data);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    setStatus("connecting");
    setNotification(null);

    try {
      if (user) {
        connectionRef.current = startMatchingSocket(user?.id, {
          onConnect: () => {
            setStatus("searching");
            setNotification("Connected! Searching for matches...");
          },
          onMatchFound: () => {
            setStatus("match_found");
            setNotification("Match found! Preparing enclave...");
          },
          onEnclaveCreated: (enclaveId: string) => {
            onClose();
            router.push(`/enclave/${enclaveId}`);
          },
          onDisconnect: () => {
            console.log("Disconnected from matching service");
          },
        });
      } else {
        setStatus("error");
        setNotification("User not found");
      }
    } catch (err) {
      setStatus("error");
      setNotification("Error starting search");
      console.error("Error starting search:", err);
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, [isOpen, user, router, onClose]);

  const stopSearch = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    onClose();
  };

  const getStatusMessage = () => {
    switch (status) {
      case "connecting":
        return "Connecting to matching service...";
      case "searching":
        return "Searching for matches...";
      case "match_found":
        return "Match found! Setting up enclave...";
      case "error":
        return "An error occurred";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fullscreen Overlay */}
      <div className="fixed inset-0 z-40 bg-gradient-to-b from-black/70 via-black/80 to-black/70 backdrop-blur-md" />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-6 text-center">
          {/* Search Button */}
          <div className="flex justify-center">
            <button
              disabled
              className="group animate-pulse-ring relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 font-semibold text-white shadow-2xl shadow-green-500/50 transition-all duration-500 ease-out focus:outline-none">
              {/* Content */}
              <div className="relative flex flex-col items-center justify-center gap-3">
                <svg
                  className="animate-float-search h-14 w-14 text-white transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-xs font-semibold tracking-wide">Searching...</span>
              </div>

              {/* Gradient shine effect */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-white via-transparent to-white opacity-0" />
            </button>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            {/* Main Status */}
            <div>
              <h2 className="text-2xl font-bold text-white">{getStatusMessage()}</h2>
            </div>

            {/* Notification */}
            {notification && <p className="text-sm text-zinc-300">{notification}</p>}

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2">
              <div
                className={`h-2 w-2 animate-pulse rounded-full ${
                  status === "error" ? "bg-red-500" : status === "match_found" ? "bg-green-500" : "bg-blue-500"
                }`}
              />
              <span className="text-xs font-medium tracking-widest text-zinc-400 uppercase">{status.replace("_", " ")}</span>
            </div>
          </div>

          {/* Stop Button */}
          <button
            onClick={stopSearch}
            className="w-full rounded-full border border-white/30 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-white/10">
            Stop Search
          </button>

          {/* Description */}
          <div className="space-y-2 border-t border-zinc-800 pt-6">
            <p className="text-xs text-zinc-400">You'll be notified when a match is found. You can cancel anytime.</p>
            <p className="text-xs text-zinc-500">Matching with others in real-time...</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-search {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(4px, -4px);
          }
          50% {
            transform: translate(0, 4px);
          }
          75% {
            transform: translate(-4px, -4px);
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        .animate-float-search {
          animation: float-search 2s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 1.5s infinite;
        }
      `}</style>
    </>
  );
}
