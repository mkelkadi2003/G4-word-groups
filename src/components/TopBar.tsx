import { useState } from "react";
import BassamLogo from "./BassamLogo";
import TeacherPanel from "./TeacherPanel";
import { AnimatedNumber } from "./ui";
import { isMusicOn, isMuted, setMuted, sfx, startMusic, stopMusic } from "../game/sound";
import { MAX_XP, teamXp, useGame } from "../game/store";

export default function TopBar() {
  const { state, active, setActive, go, teacher, setTeacher } = useGame();
  const [panel, setPanel] = useState(false);
  const [muted, setM] = useState(isMuted());
  const [music, setMusic] = useState(isMusicOn());
  const inGame = state.teams.length > 0 && !["intro", "countdown", "teams"].includes(state.screen);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-white/10 bg-indigo-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-3 py-2">
          <BassamLogo compact />
          <button onClick={() => inGame && go("map")} className="hidden font-title text-xl font-extrabold leading-tight sm:block">
            <span className="text-yellow-300">Word</span> Level-Up <span className="text-pink-300">Challenge</span>
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {inGame && (
              <>
                <button className="btn-game bg-sky-500 px-3 py-2 text-base" onClick={() => go("map")}>
                  🗺️ Map
                </button>
                <button className="btn-game bg-amber-500 px-3 py-2 text-base text-amber-950" onClick={() => go("leaderboard")}>
                  🏆 Leaderboard
                </button>
              </>
            )}
            <button
              className="btn-game bg-white/15 px-3 py-2 text-base"
              title="Background music"
              onClick={() => {
                if (music) stopMusic();
                else startMusic();
                setMusic(!music);
              }}
            >
              {music ? "🎵 On" : "🎵 Off"}
            </button>
            <button
              className="btn-game bg-white/15 px-3 py-2 text-base"
              title="Sound effects"
              onClick={() => {
                setMuted(!muted);
                setM(!muted);
                if (muted) sfx.click();
                setMusic(isMusicOn());
              }}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              className={`btn-game px-3 py-2 text-base ${teacher ? "bg-yellow-400 text-amber-950" : "bg-white/15"}`}
              onClick={() => {
                sfx.click();
                if (!teacher) setTeacher(true);
                setPanel(true);
              }}
            >
              {teacher ? "👩‍🏫 Teacher ON" : "🔒 Teacher"}
            </button>
          </div>
        </div>

        {inGame && (
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 pb-2">
            {state.teams.map((t) => {
              const xp = teamXp(t);
              const on = t.id === active?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    sfx.click();
                    setActive(t.id);
                  }}
                  className={`flex min-w-[150px] shrink-0 items-center gap-2 rounded-2xl border-4 px-3 py-1.5 text-left transition-all ${
                    on ? "scale-105 bg-white/20" : "border-transparent bg-white/5 opacity-75 hover:opacity-100"
                  }`}
                  style={{ borderColor: on ? t.color : undefined }}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="flex-1">
                    <span className="block max-w-[120px] truncate text-sm font-bold">{t.name}</span>
                    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                      <span className="block h-full transition-all duration-700" style={{ width: `${(xp / MAX_XP) * 100}%`, background: t.color }} />
                    </span>
                  </span>
                  <span className="font-title text-lg font-extrabold text-yellow-300">
                    <AnimatedNumber value={xp} />
                  </span>
                </button>
              );
            })}
            <span className="self-center whitespace-nowrap pl-2 text-xs text-white/50">👆 Tap a team to play as them</span>
          </div>
        )}
      </header>
      {panel && <TeacherPanel onClose={() => setPanel(false)} />}
    </>
  );
}
