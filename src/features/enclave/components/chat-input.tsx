"use client";

import { useState } from "react";
import { fetchSendDispatch } from "../service/fetch.util";
import { Dispatch } from "../service/model";
import { useMyUser } from "@/features/user";
import { RtcStatus } from "../service/rtc.model";

interface ChatInputProps {
  enclaveId: string;
  sendDispatch?: (dispatch: Dispatch) => void;
  rtcStatus?: RtcStatus;
}

export default function ChatInput({ enclaveId, sendDispatch, rtcStatus = "connected" }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userName = useMyUser((state) => state.data?.name);

  const isDisconnected = rtcStatus === "disconnected";
  const isConnecting = rtcStatus === "connecting";

  const getStatusColor = () => {
    switch (rtcStatus) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "connecting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "disconnected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = () => {
    switch (rtcStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  const getStatusIndicator = () => {
    switch (rtcStatus) {
      case "connected":
        return (
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-green-500"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
        );
      case "connecting":
        return (
          <span className="relative inline-flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-spin rounded-full border border-yellow-500"
              style={{ borderTopColor: "transparent" }}></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500/50"></span>
          </span>
        );
      case "disconnected":
        return <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>;
      default:
        return null;
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      fetchSendDispatch(content, enclaveId);
      sendDispatch?.(
        new Dispatch({ id: crypto.randomUUID(), content, enclaveId, createdAt: new Date().toISOString() }, userName),
      );
      setContent("");
    } catch (err) {
      console.error("Error sending dispatch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !isDisconnected) {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/50 p-4">
      {/* RTC Status Bar */}
      {(isDisconnected || isConnecting) && (
        <div className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${getStatusColor()}`}>
          {getStatusIndicator()}
          <span>{getStatusText()}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisconnected || isConnecting}
          placeholder={isDisconnected ? "Waiting to reconnect..." : "Type your dispatch... (Enter to send)"}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pr-14 text-sm text-white placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
        />
        {content.trim() && (
          <button
            onClick={handleSend}
            disabled={isLoading || isDisconnected || isConnecting}
            className="absolute! right-6 bottom-6.5 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2 text-white transition-all hover:shadow-lg hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:right-8">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4379088 C3.03521743,10.5950061 3.34915502,10.7521035 3.50612381,10.7521035 L16.6915026,11.5375905 C16.6915026,11.5375905 17.1624089,11.5375905 17.1624089,12.0088827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
