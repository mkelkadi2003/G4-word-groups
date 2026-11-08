import { useState } from "react";
import Maya from "../components/Maya";
import { TEAM_COLORS, TEAM_EMOJIS, useGame } from "../game/store";
import { sfx } from "../game/sound";

const SUGGESTIONS = ["Magic Mice", "Font Fighters", "Bold Heroes", "Print Rockets", "Pixel Pandas", "Word Ninjas"];

export default function Teams() {
  const { setTeams, go, state } = useGame();
  const [list, setList] = useState<{ name: string; emoji: string }[]>(
    state.teams.length ? state.teams.map((t) => ({ name: t.name, emoji: t.emoji })) : [
      { name: "", emoji: "🦁" },
      { name: "", emoji: "🐉" },
    ]
  );
  const [err, setErr] = useState(false);

  const update = (i: number, patch: Partial<{ name: string; emoji: string }>) => setList(list.map((t, j) => (j === i ? { ...t, ...patch } : t)));

  const start = () => {
    const clean = list.map((t, i) => ({ ...t, name: t.name.trim() || SUGGESTIONS[i] }));
    if (clean.length < 1) {
      setErr(true);
      sfx.fail();
      return;
    }
    setTeams(clean);
    sfx.success();
    go("map");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <div className="anim-float">
          <Maya mood="excited" size={140} />
        </div>
        <div>
          <h1 className="font-title text-4xl font-extrabold md:text-6xl">
            Build Your <span className="text-yellow-300">Wizard Teams!</span>
          </h1>
          <p className="mt-2 text-xl text-white/80">Choose a cool team name and a mascot. You can add up to 6 teams.</p>
        </div>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${err ? "anim-shake" : ""}`}>
        {list.map((t, i) => (
          <div key={i} className="card-game anim-pop border-l-[12px]" style={{ borderLeftColor: TEAM_COLORS[i % TEAM_COLORS.length], animationDelay: `${i * 0.07}s` }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-title text-xl font-extrabold">Team {i + 1}</span>
              {list.length > 1 && (
                <button className="rounded-lg bg-rose-500/80 px-3 py-1 text-sm font-bold" onClick={() => { sfx.uncheck(); setList(list.filter((_, j) => j !== i)); }}>
                  ✖ Remove
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{t.emoji}</span>
              <input
                value={t.name}
                maxLength={20}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder={SUGGESTIONS[i]}
                className="w-full rounded-2xl border-4 border-white/20 bg-white px-4 py-3 text-2xl font-bold text-slate-900 outline-none focus:border-yellow-300"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {TEAM_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => { sfx.click(); update(i, { emoji: e }); }}
                  className={`h-10 w-10 rounded-xl text-2xl transition ${t.emoji === e ? "scale-110 bg-yellow-300" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {list.length < 6 && (
          <button
            className="btn-game bg-sky-500"
            onClick={() => {
              sfx.click();
              setList([...list, { name: "", emoji: TEAM_EMOJIS[list.length % TEAM_EMOJIS.length] }]);
            }}
          >
            ➕ Add Team
          </button>
        )}
        <button className="btn-game anim-glow bg-gradient-to-r from-green-400 to-emerald-600 px-10 text-2xl" onClick={start}>
          ✨ Let's Go, Wizards!
        </button>
      </div>
    </div>
  );
}
