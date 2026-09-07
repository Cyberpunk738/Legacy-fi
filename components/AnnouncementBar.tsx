"use client";

import React from "react";
import { ArrowRight, HeartHandshake } from "lucide-react";

interface AnnouncementBarProps {
  onOpenDemo?: () => void;
}

export function AnnouncementBar({ onOpenDemo }: AnnouncementBarProps) {
  return (
    <aside aria-label="Welcome Announcement" className="w-full bg-[#fff6df] border-b border-[#ebd7a5] text-[#1d1d20] py-2 px-4 text-center text-[13px] font-normal transition-colors">
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-medium text-[#2e7317] bg-white/80 px-2 py-0.5 rounded-full text-xs border border-[#2e7317]/20">
          <HeartHandshake className="w-3.5 h-3.5 text-[#2e7317]" />
          Estate Memory Protocol
        </span>
        <span>
          Planning digital inheritance with evolving family context on <strong className="font-semibold">Base</strong> & <strong className="font-semibold">Sibyl Memory</strong>.
        </span>
        {onOpenDemo && (
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1 text-[#5e5cff] font-medium hover:underline ml-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5e5cff] rounded"
          >
            <span>Take the 3-Minute Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
