import { useState } from "react";

/**
 * Al-Bassam Schools logo.
 * If the official logo image exists at public/bassam-logo.png it is used,
 * otherwise a vector recreation of the emblem is shown.
 */
export function BassamEmblem({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-label="Al-Bassam Schools emblem">
      <defs>
        <radialGradient id="globe" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#7b6fc2" />
          <stop offset="100%" stopColor="#1e1650" />
        </radialGradient>
        <linearGradient id="page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde5b0" />
          <stop offset="100%" stopColor="#d9a866" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="white" />
      {/* outer swooshes */}
      <path d="M100 8 A92 92 0 1 1 30 160" fill="none" stroke="#2a1d5c" strokeWidth="9" strokeLinecap="round" />
      <path d="M58 34 A70 70 0 0 1 150 40" fill="none" stroke="#2a1d5c" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 22 A78 78 0 0 0 50 160" fill="none" stroke="#2a1d5c" strokeWidth="5" strokeLinecap="round" />
      {/* open book forming B */}
      <path d="M58 44 L110 36 Q140 40 132 70 Q126 88 112 92 Q140 98 134 128 Q128 150 100 152 L92 152 Z" fill="url(#page)" stroke="#5b3a12" strokeWidth="2" />
      <path d="M78 46 L110 42 Q132 46 126 70 Q120 86 104 92 Q132 100 126 126 Q120 144 100 146" fill="none" stroke="#1f1500" strokeWidth="3" />
      {/* pencil */}
      <g transform="rotate(-25 78 110)">
        <rect x="70" y="44" width="15" height="110" rx="2" fill="#f2a33a" stroke="#8a5310" strokeWidth="2" />
        <rect x="70" y="40" width="15" height="10" rx="2" fill="#c81e1e" />
        <path d="M70 154 L77.5 172 L85 154 Z" fill="#f6d7a6" stroke="#8a5310" strokeWidth="2" />
        <path d="M75.5 167 L77.5 172 L79.5 167 Z" fill="#222" />
      </g>
      {/* S swoosh */}
      <path d="M150 128 Q120 112 118 132 Q120 150 146 152 Q160 158 140 172 L96 194" fill="none" stroke="#2a1d5c" strokeWidth="6" strokeLinecap="round" />
      {/* globe */}
      <circle cx="146" cy="76" r="20" fill="url(#globe)" />
      <ellipse cx="148" cy="80" rx="27" ry="6" fill="none" stroke="#d32f2f" strokeWidth="2" transform="rotate(-10 148 80)" />
    </svg>
  );
}

export default function BassamLogo({ compact = false }: { compact?: boolean }) {
  const [imgOk, setImgOk] = useState(true);
  if (imgOk) {
    return (
      <div className={`flex items-center rounded-2xl bg-white px-2 py-1 shadow-lg ${compact ? "h-12" : "h-20 md:h-24"}`}>
        <img
          src="./bassam-logo.png"
          alt="Al-Bassam Schools – مدارس البسام"
          className="h-full w-auto object-contain"
          onError={() => setImgOk(false)}
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 rounded-2xl bg-white shadow-lg ${compact ? "px-2 py-1" : "px-4 py-2"}`}>
      <BassamEmblem size={compact ? 40 : 72} />
      <div className="leading-tight">
        <div className={`font-title font-extrabold text-[#2a1d5c] ${compact ? "text-sm" : "text-xl md:text-2xl"}`}>
          Al-<span className="text-[#d9a866]">B</span>assam Schools
        </div>
        <div className={`font-bold text-[#2a1d5c] ${compact ? "text-xs" : "text-lg"}`} dir="rtl">
          مدارس البسام
        </div>
      </div>
    </div>
  );
}
