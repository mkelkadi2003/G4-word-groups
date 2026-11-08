import { useEffect, useState } from "react";
import Maya from "../components/Maya";
import MessyDoc from "../components/MessyDoc";
import BassamLogo from "../components/BassamLogo";
import { useGame } from "../game/store";
import { sfx, startMusic } from "../game/sound";

export default function Intro() {
  const { go, state } = useGame();
  const [secs, setSecs] = useState(5 * 60 - 1);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 5 * 60 - 1 : s - 1)), 1000);
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => setStep(3), 2600);
    return () => {
      clearInterval(id);
      [t1, t2, t3].forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex justify-center anim-slide">
        <BassamLogo />
      </div>

      {/* breaking news ticker */}
      <div className="mb-6 overflow-hidden rounded-2xl border-4 border-red-400 bg-red-600 shadow-xl">
        <div className="flex items-center">
          <span className="anim-pulse-red shrink-0 bg-yellow-300 px-4 py-2 font-title text-xl font-extrabold text-red-700">🚨 BREAKING NEWS</span>
          <div className="relative flex-1 overflow-hidden whitespace-nowrap py-2 font-bold">
            <span className="inline-block animate-[marquee_14s_linear_infinite] pl-[100%]">
              Maya's newsletter is MESSY! • Deadline is coming! • Word Wizards needed NOW! • Can YOUR team save the day? •
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>

      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="font-title text-5xl font-extrabold leading-tight md:text-7xl anim-pop">
            Help <span className="text-pink-400">Maya</span> Launch Her <span className="text-yellow-300">Newsletter!</span>
          </h1>
          {step >= 1 && (
            <p className="anim-slide rounded-3xl bg-white/10 p-5 text-xl leading-relaxed md:text-2xl">
              Maya is making her <b>school newsletter</b>. But oh no! 😱 Her document is <b className="text-red-300">messy</b>, hard to read, and <b>not ready</b> to print!
            </p>
          )}
          {step >= 2 && (
            <p className="anim-slide text-2xl font-bold text-yellow-200 md:text-3xl">
              Maya needs YOU! 🫵 Can your team become <span className="text-pink-300">Word Wizards</span> 🧙 and rescue her newsletter?
            </p>
          )}
          {step >= 3 && (
            <div className="anim-pop flex flex-wrap gap-3">
              <button
                className="btn-game anim-glow bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-10 py-5 text-3xl"
                onClick={() => {
                  sfx.go();
                  startMusic();
                  go("countdown");
                }}
              >
                🚀 START ADVENTURE
              </button>
              {state.teams.length > 0 && (
                <button className="btn-game bg-sky-500 text-xl" onClick={() => go("map")}>
                  ▶ Continue saved game
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <div className="card-game mb-4 border-red-400/60 bg-red-950/50 px-8 text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-red-200">⏰ Newsletter deadline in</div>
            <div className="font-title text-6xl font-extrabold tabular-nums text-red-400 anim-pulse-red rounded-xl">
              {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="anim-float">
              <Maya mood="worried" size={200} />
            </div>
            <div className="anim-wiggle">
              <MessyDoc />
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-white px-4 py-2 text-lg font-bold text-slate-800 shadow-lg">
            💬 "Please help me! My newsletter is a disaster!"
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { n: 1, icon: "📖", t: "Emergency Rescue", d: "Views & Read Mode", c: "from-sky-500 to-blue-700" },
          { n: 2, icon: "🎨", t: "Style Makeover", d: "Find & Replace, Fonts, Web Layout", c: "from-pink-500 to-fuchsia-700" },
          { n: 3, icon: "🖨️", t: "Printing Pro", d: "Print Preview & Print Settings", c: "from-orange-500 to-red-700" },
        ].map((l) => (
          <div key={l.n} className={`anim-slide rounded-3xl bg-gradient-to-br ${l.c} p-5 shadow-xl`} style={{ animationDelay: `${l.n * 0.15}s` }}>
            <div className="text-5xl">{l.icon}</div>
            <div className="mt-2 text-sm font-bold uppercase text-white/80">Level {l.n}</div>
            <div className="font-title text-2xl font-extrabold">{l.t}</div>
            <div className="text-white/90">{l.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
