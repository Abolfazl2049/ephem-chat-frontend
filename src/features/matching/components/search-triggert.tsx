"use client";

import { useState } from "react";

interface SearchTriggerProps {
  onSearch?: (query: string) => void;
}

export default function SearchTrigger({ onSearch }: SearchTriggerProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Call the onSearch callback if provided
      if (onSearch) {
        onSearch("");
      }
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 20000));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Fullscreen Overlay with gradient */}
      {isSearching && (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-black/70 via-black/80 to-black/70 backdrop-blur-md transition-opacity duration-500" />
      )}

      {/* Container with animation */}
      <div
        className={`transition-all duration-500 ease-out ${
          isSearching ? "fixed inset-0 z-50 flex items-center justify-center" : "flex justify-center"
        }`}>
        {/* Circle Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={`group relative flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 font-semibold text-white transition-all duration-500 ease-out hover:shadow-2xl focus:outline-none ${
            isSearching
              ? "animate-pulse-ring h-40 w-40 shadow-2xl shadow-green-500/50"
              : "h-40 w-40 shadow-lg shadow-green-500/40 hover:scale-110 hover:shadow-green-500/60"
          }`}>
          {/* Animated rings on hover */}
          {!isSearching && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
              <div className="absolute inset-0 animate-pulse rounded-full border border-green-500/50 opacity-0 group-hover:opacity-100" />
            </>
          )}

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center gap-3">
            <svg
              className={`h-14 w-14 text-white transition-transform duration-300 ${
                isSearching ? "animate-float-search" : "group-hover:scale-125"
              }`}
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
            {isSearching && <span className="text-xs font-semibold tracking-wide">Searching...</span>}
            {!isSearching && <span className="text-xs font-semibold tracking-widest uppercase opacity-90">Search</span>}
          </div>

          {/* Gradient shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-transparent to-white opacity-0 group-hover:animate-pulse group-hover:opacity-20" />
        </button>
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
