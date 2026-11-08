import { useEffect } from "react";
import BassamLogo from "../components/BassamLogo";
import Maya from "../components/Maya";
import { AnimatedNumber, Confetti } from "../components/ui";
import { sfx } from "../game/sound";
import { isMaster, teamXp, useGame, type Team } from "../game/store";

function Trophy({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M25 12 H75 V35 Q75 60 50 62 Q25 60 25 35 Z" fill={color} stroke="#0002" strokeWidth="2" />
      <path d="M25 18 Q8 18 10 32 Q12 44 27 45" fill="none" stroke={color} strokeWidth="6" />
      <path d="M75 18 Q92 18 90 32 Q88 44 73 45" fill="none" stroke={color} strokeWidth="6" />
      <rect x="44" y="60" width="12" height="16" fill={color} />
      <rect x="30" y="76" width="40" height="12" rx="3" fill={color} stroke="#0002" strokeWidth="2" />
      <path d="M36 20 Q38 40 48 52" stroke="white" strokeOpacity="0.6" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const PODIUM = [
  { color: "#facc15", label: "GOLD", h: "h-48", trophy: 110, order: "md:order-2" },
  { color: "#cbd5e1", label: "SILVER", h: "h-36", trophy: 90, order: "md:order-1" },
  { color: "#d97706", label: "BRONZE", h: "h-28", trophy: 80, order: "md:order-3" },
];

export default function Victory() {
  const { state, restart, go } = useGame();
  const ranked = [...state.teams].sort((a, b) => teamXp(b) - teamXp(a));
  const winner: Team | undefined = ranked[0];
  const topXp = winner ? teamXp(winner) : 0;
  const winners = ranked.filter((t) => teamXp(t) === topXp);

  useEffect(() => {
    sfx.fanfare();
  }, []);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 text-center">
      <Confetti count={160} />
      <div className="mb-4 flex justify-center">
        <BassamLogo />
      </div>
      <h1 className="anim-pop font-title text-4xl font-extrabold leading-tight md:text-6xl">
        🎉 CONGRATULATIONS! <br />
        <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-sky-300 bg-clip-text text-transparent">YOU SAVED MAYA'S NEWSLETTER!</span>
      </h1>

      <div className="my-6 flex items-center justify-center gap-4">
        <Maya mood="excited" size={150} className="anim-float" />
        <div className="rounded-3xl bg-white px-5 py-3 text-xl font-bold text-slate-800 shadow-xl">💬 "Thank you, Word Wizards! You're the best!" 💖</div>
      </div>

      {winner && (
        <div className="anim-pop mx-auto mb-8 max-w-2xl rounded-[2rem] border-4 border-yellow-300 bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-pink-500/30 p-6 anim-glow">
          <div className="text-lg font-bold uppercase tracking-widest text-yellow-200">{winners.length > 1 ? "🏆 It's a tie! Winning teams" : "🏆 Winning team"}</div>
          <div className="font-title text-5xl font-extrabold md:text-6xl">
            {winners.map((w) => `${w.emoji} ${w.name}`).join(" & ")}
          </div>
          <div className="mt-2 font-title text-4xl font-extrabold text-yellow-300">
            <AnimatedNumber value={topXp} /> XP
          </div>
        </div>
      )}

      {/* Podium */}
      <div className="mb-10 flex flex-col items-center justify-center gap-6 md:flex-row md:items-end">
        {ranked.slice(0, 3).map((t, i) => (
          <div key={t.id} className={`flex w-56 flex-col items-center ${PODIUM[i].order}`}>
            <div className="anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
              <Trophy color={PODIUM[i].color} size={PODIUM[i].trophy} />
            </div>
            <div className="text-4xl">{t.emoji}</div>
            <div className="font-title text-2xl font-extrabold">{t.name}</div>
            <div className="font-bold text-yellow-300">{teamXp(t)} XP</div>
            <div className={`anim-rise mt-2 flex w-full items-start justify-center rounded-t-2xl pt-3 font-title text-2xl font-extrabold text-slate-900 ${PODIUM[i].h}`} style={{ background: PODIUM[i].color, animationDelay: `${0.3 + i * 0.2}s` }}>
              {i + 1} · {PODIUM[i].label}
            </div>
          </div>
        ))}
      </div>

      {/* Master badge */}
      <div className="mx-auto mb-8 max-w-3xl card-game">
        <div className="mx-auto mb-3 flex h-40 w-40 items-center justify-center rounded-full border-8 border-yellow-300 bg-gradient-to-br from-purple-600 to-indigo-800 shadow-2xl anim-glow">
          <div>
            <div className="text-6xl">🧙</div>
            <div className="font-title text-xs font-extrabold leading-tight text-yellow-300">MASTER<br />WORD WIZARDS</div>
          </div>
        </div>
        <h2 className="font-title text-3xl font-extrabold text-yellow-300">MASTER WORD WIZARDS</h2>
        <p className="mb-3 text-lg">Awarded to teams who completed all 3 levels:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {state.teams.filter(isMaster).map((t) => (
            <span key={t.id} className="anim-pop rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 px-4 py-2 text-lg font-extrabold text-purple-900">
              {t.emoji} {t.name}
            </span>
          ))}
          {state.teams.filter(isMaster).length === 0 && <span className="text-white/60">Keep practising – you'll get it next time! 💪</span>}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pb-10">
        <button className="btn-game bg-sky-500" onClick={() => go("leaderboard")}>🏆 Full Leaderboard</button>
        <button className="btn-game bg-purple-500" onClick={() => restart(true)}>🔁 Play Again (same teams)</button>
        <button
          className="btn-game bg-gradient-to-r from-pink-500 to-rose-600 text-2xl"
          onClick={() => {
            restart(false);
            sfx.whoosh();
          }}
        >
          🎮 New Classroom Session
        </button>
      </div>
    </div>
  );
}
