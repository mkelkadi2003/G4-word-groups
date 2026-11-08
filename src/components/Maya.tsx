type Mood = "worried" | "happy" | "excited" | "thinking";

export default function Maya({ mood = "happy", size = 180, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const mouth =
    mood === "worried" ? (
      <path d="M86 132 Q100 122 114 132" stroke="#7a2e2e" strokeWidth="4" fill="none" strokeLinecap="round" />
    ) : mood === "excited" ? (
      <path d="M84 124 Q100 148 116 124 Z" fill="#7a2e2e" />
    ) : mood === "thinking" ? (
      <path d="M90 130 L110 128" stroke="#7a2e2e" strokeWidth="4" strokeLinecap="round" />
    ) : (
      <path d="M86 124 Q100 140 114 124" stroke="#7a2e2e" strokeWidth="4" fill="none" strokeLinecap="round" />
    );
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" className={className} aria-label="Maya">
      {/* ponytail */}
      <path d="M150 60 Q190 70 178 130 Q170 110 152 100 Z" fill="#5b3416" className="anim-wiggle" style={{ transformOrigin: "150px 70px" }} />
      <circle cx="152" cy="66" r="7" fill="#ec4899" />
      {/* body */}
      <path d="M50 240 Q50 175 100 172 Q150 175 150 240 Z" fill="#8b5cf6" />
      <path d="M85 174 L100 192 L115 174" fill="#fff" />
      <text x="100" y="225" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fde047">W</text>
      {/* neck */}
      <rect x="90" y="155" width="20" height="22" fill="#f1c19b" />
      {/* head */}
      <circle cx="100" cy="100" r="60" fill="#f6cfaa" />
      {/* hair */}
      <path d="M40 100 Q38 40 100 38 Q162 40 160 100 Q150 70 120 62 Q100 80 60 72 Q46 84 40 100 Z" fill="#5b3416" />
      {/* cheeks */}
      <circle cx="68" cy="118" r="8" fill="#f9a8a8" opacity="0.7" />
      <circle cx="132" cy="118" r="8" fill="#f9a8a8" opacity="0.7" />
      {/* eyes */}
      <g className="eye-blink">
        <ellipse cx="78" cy="100" rx="8" ry="10" fill="#1f2937" />
        <ellipse cx="122" cy="100" rx="8" ry="10" fill="#1f2937" />
        <circle cx="81" cy="96" r="3" fill="white" />
        <circle cx="125" cy="96" r="3" fill="white" />
      </g>
      {/* brows */}
      {mood === "worried" ? (
        <>
          <path d="M68 82 L88 88" stroke="#5b3416" strokeWidth="4" strokeLinecap="round" />
          <path d="M132 82 L112 88" stroke="#5b3416" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M68 84 Q78 78 88 84" stroke="#5b3416" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M112 84 Q122 78 132 84" stroke="#5b3416" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {mouth}
      {mood === "worried" && <path d="M146 80 Q152 92 146 98 Q140 92 146 80 Z" fill="#60a5fa" />}
      {/* glasses-free star hairclip */}
      <path d="M60 58 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill="#fde047" />
    </svg>
  );
}
