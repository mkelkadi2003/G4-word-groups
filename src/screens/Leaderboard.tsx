import { AnimatedNumber } from "../components/ui";
import { BADGES, MAX_XP, isMaster, levelDone, teamXp, useGame } from "../game/store";

export default function Leaderboard() {
  const { state, go } = useGame();
  const ranked = [...state.teams].sort((a, b) => teamXp(b) - teamXp(a));
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 text-center">
        <div className="text-7xl anim-float">🏆</div>
        <h1 className="font-title text-5xl font-extrabold md:text-6xl">
          Team <span className="text-yellow-300">Leaderboard</span>
        </h1>
        <p className="text-xl text-white/70">Live XP · Max {MAX_XP} XP</p>
      </div>

      <div className="space-y-4">
        {ranked.map((t, i) => {
          const xp = teamXp(t);
          return (
            <div
              key={t.id}
              className={`card-game anim-slide flex flex-col gap-4 md:flex-row md:items-center ${i === 0 && xp > 0 ? "anim-glow border-yellow-300/70" : ""}`}
              style={{ animationDelay: `${i * 0.1}s`, borderLeft: `12px solid ${t.color}` }}
            >
              <div className="flex items-center gap-4 md:w-72">
                <div className="w-14 text-center font-title text-5xl font-extrabold">{medals[i] ?? `#${i + 1}`}</div>
                <div className="text-5xl">{t.emoji}</div>
                <div>
                  <div className="font-title text-2xl font-extrabold">{t.name}</div>
                  <div className="text-sm text-white/70">
                    {[1, 2, 3].map((l) => (levelDone(t, l as 1 | 2 | 3) ? "⭐" : "☆")).join(" ")} Levels
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-7 overflow-hidden rounded-full border-2 border-white/20 bg-black/40">
                  <div
                    className="flex h-full items-center justify-end rounded-full pr-3 text-sm font-extrabold transition-all duration-1000"
                    style={{ width: `${Math.max(6, (xp / MAX_XP) * 100)}%`, background: `linear-gradient(90deg, ${t.color}, #facc15)` }}
                  >
                    {Math.round((xp / MAX_XP) * 100)}%
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {BADGES.filter((b) => t.approvals[b.key]).map((b) => (
                    <span key={b.key} className="anim-pop rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                      {b.icon} {b.name}
                    </span>
                  ))}
                  {isMaster(t) && <span className="anim-pop rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 px-3 py-1 text-sm font-extrabold text-purple-900">🧙 MASTER WORD WIZARDS</span>}
                  {BADGES.every((b) => !t.approvals[b.key]) && <span className="text-sm text-white/50">No badges yet – start a mission!</span>}
                </div>
              </div>
              <div className="text-center md:w-32">
                <div className="font-title text-5xl font-extrabold text-yellow-300">
                  <AnimatedNumber value={xp} />
                </div>
                <div className="text-sm font-bold text-white/60">XP</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3 text-center sm:grid-cols-3 md:grid-cols-5">
        {[
          ["📖 Level 1", 100],
          ["🎨 Level 2", 150],
          ["🖨️ Level 3", 200],
          ["🤝 Teamwork", 50],
          ["⚡ Speed", 50],
        ].map(([l, x]) => (
          <div key={l} className="rounded-2xl bg-white/10 p-3">
            <div className="font-bold">{l}</div>
            <div className="font-title text-2xl font-extrabold text-yellow-300">{x} XP</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button className="btn-game bg-sky-500" onClick={() => go("map")}>🗺️ Back to Map</button>
        <button className="btn-game bg-gradient-to-r from-yellow-400 to-orange-500 text-amber-950" onClick={() => go("victory")}>👑 Final Results</button>
      </div>
    </div>
  );
}
