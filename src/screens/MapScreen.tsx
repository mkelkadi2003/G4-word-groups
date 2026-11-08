import Maya from "../components/Maya";
import { downloadNewsletter } from "../game/newsletter";
import { sfx } from "../game/sound";
import { MAX_XP, isMaster, levelDone, levelUnlocked, teamXp, useGame, type Screen } from "../game/store";

const LEVELS: { n: 1 | 2 | 3; screen: Screen; icon: string; title: string; topic: string; xp: number; grad: string }[] = [
  { n: 1, screen: "level1", icon: "📖", title: "Emergency Rescue", topic: "Views & Read Mode", xp: 100, grad: "from-sky-400 to-blue-700" },
  { n: 2, screen: "level2", icon: "🍌", title: "The Style Makeover", topic: "Find & Replace, Fonts, Web Layout", xp: 150, grad: "from-pink-400 to-fuchsia-700" },
  { n: 3, screen: "level3", icon: "🖨️", title: "The Printing Pro", topic: "Print Preview & Print Settings", xp: 200, grad: "from-orange-400 to-red-700" },
];

export default function MapScreen() {
  const { state, active, go } = useGame();
  if (!active) return null;
  const xp = teamXp(active);
  const allDone = state.teams.length > 0 && state.teams.every(isMaster);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="anim-float">
          <Maya mood={xp > 300 ? "excited" : "happy"} size={120} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="text-lg text-white/70">Now playing:</div>
          <h1 className="font-title text-4xl font-extrabold md:text-5xl" style={{ color: active.color }}>
            {active.emoji} Team {active.name}
          </h1>
          <div className="mx-auto mt-2 max-w-md md:mx-0">
            <div className="mb-1 flex justify-between font-bold">
              <span>⭐ XP</span>
              <span className="text-yellow-300">
                {xp} / {MAX_XP}
              </span>
            </div>
            <div className="h-5 overflow-hidden rounded-full border-2 border-white/20 bg-black/40">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 transition-all duration-1000" style={{ width: `${(xp / MAX_XP) * 100}%` }} />
            </div>
          </div>
        </div>
        <button className="btn-game bg-gradient-to-r from-blue-500 to-indigo-600 text-lg" onClick={() => { sfx.check(); downloadNewsletter(state.secretWords); }}>
          📥 Download Maya's Newsletter (.doc)
        </button>
      </div>

      <h2 className="mb-4 text-center font-title text-3xl font-extrabold">🗺️ Mission Map</h2>
      <div className="relative grid gap-6 md:grid-cols-3">
        <svg className="pointer-events-none absolute left-0 top-1/2 hidden h-8 w-full -translate-y-1/2 md:block" preserveAspectRatio="none" viewBox="0 0 100 10">
          <path d="M5 5 Q25 0 50 5 T95 5" stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        </svg>
        {LEVELS.map((l) => {
          const unlocked = levelUnlocked(active, l.n, state.unlockAll);
          const done = levelDone(active, l.n);
          return (
            <button
              key={l.n}
              disabled={!unlocked}
              onClick={() => go(l.screen)}
              className={`group relative overflow-hidden rounded-[2rem] border-4 p-6 text-left shadow-2xl transition-all anim-pop ${
                unlocked ? `bg-gradient-to-br ${l.grad} border-white/30 hover:-translate-y-2 hover:rotate-1` : "cursor-not-allowed border-white/10 bg-slate-800 grayscale"
              }`}
              style={{ animationDelay: `${l.n * 0.12}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-bold">LEVEL {l.n}</span>
                <span className="rounded-full bg-yellow-300 px-3 py-1 text-sm font-extrabold text-purple-900">{l.xp} XP</span>
              </div>
              <div className={`my-4 text-center text-7xl ${unlocked && !done ? "anim-float" : ""}`}>{unlocked ? l.icon : "🔒"}</div>
              <div className="font-title text-2xl font-extrabold">{l.title}</div>
              <div className="text-white/85">{l.topic}</div>
              <div className="mt-4 font-title text-xl font-extrabold">
                {done ? "✅ COMPLETE! ⭐⭐⭐" : unlocked ? "▶ PLAY MISSION" : `Finish Level ${l.n - 1} to unlock`}
              </div>
              {done && <div className="absolute -right-8 top-6 rotate-45 bg-emerald-400 px-10 py-1 text-sm font-extrabold text-emerald-950">DONE</div>}
            </button>
          );
        })}
      </div>

      {isMaster(active) && (
        <div className="mt-8 anim-pop rounded-3xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-500/30 to-pink-500/30 p-6 text-center">
          <div className="text-6xl">🧙‍♂️👑</div>
          <div className="font-title text-3xl font-extrabold text-yellow-300">Team {active.name} finished all levels!</div>
          <p className="text-lg">Help other teams, or ask your teacher to show the winners.</p>
          {allDone && (
            <button className="btn-game mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-2xl text-amber-950 anim-glow" onClick={() => go("victory")}>
              🏆 Show the Final Victory!
            </button>
          )}
        </div>
      )}

      <div className="mt-8 card-game">
        <h3 className="mb-2 font-title text-xl font-extrabold">📋 How to play</h3>
        <ol className="grid gap-2 text-lg md:grid-cols-2">
          <li>1️⃣ Download Maya's newsletter and open it in <b>Microsoft Word</b>.</li>
          <li>2️⃣ Choose a mission and read the steps.</li>
          <li>3️⃣ Do each step in Word, then tick it here ✅.</li>
          <li>4️⃣ Call your teacher 🙋 to approve and win XP ⭐!</li>
        </ol>
      </div>
    </div>
  );
}
