"use client";

import { useState } from "react";
import SearchingOverlay from "./searching-overlay";

interface SearchTriggerProps {
  onSearch?: (query: string) => void;
}

export default function SearchTrigger({ onSearch }: SearchTriggerProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleClick = () => {
    setIsOverlayOpen(true);
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={handleClick}
        className="group relative mx-auto flex h-40 w-40 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 font-semibold text-white shadow-lg shadow-green-500/40 transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-green-500/60 focus:outline-none">
        {/* Animated rings on hover */}
        <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
        <div className="absolute inset-0 animate-pulse rounded-full border border-green-500/50 opacity-0 group-hover:opacity-100" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-3">
          <svg
            className="h-14 w-14 transition-transform duration-300 group-hover:scale-125"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs font-semibold tracking-widest uppercase opacity-90">Search</span>
        </div>

        {/* Gradient shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-transparent to-white opacity-0 group-hover:animate-pulse group-hover:opacity-20" />
      </button>

      {/* Searching Overlay Modal */}
      <SearchingOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </>
  );
}
