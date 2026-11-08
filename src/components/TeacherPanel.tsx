import { useState } from "react";
import { BADGES, MAX_XP, XP_VALUES, teamXp, useGame, type ApprovalKey } from "../game/store";
import { bananaCount } from "../game/newsletter";
import { sfx } from "../game/sound";

const COLS: { key: ApprovalKey; label: string }[] = [
  { key: "l1", label: "L1 Read Mode" },
  { key: "l2a", label: "L2 Banana" },
  { key: "l2b", label: "L2 Style" },
  { key: "l2c", label: "L2 Web" },
  { key: "l3", label: "L3 Print" },
  { key: "bonusTeam", label: "🤝 Teamwork" },
  { key: "bonusSpeed", label: "⚡ Speed" },
];

export default function TeacherPanel({ onClose }: { onClose: () => void }) {
  const { state, approve, updateTeam, setSecretWords, setUnlockAll, setTeacher, restart, go, celebrate } = useGame();
  const [words, setWords] = useState(state.secretWords);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div className="anim-pop my-6 w-full max-w-5xl rounded-3xl border-4 border-yellow-300 bg-slate-900 p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="font-title text-3xl font-extrabold text-yellow-300">👩‍🏫 Teacher Control Panel</h2>
          <button className="btn-game ml-auto bg-slate-600 px-4 py-2 text-base" onClick={() => { setTeacher(false); onClose(); }}>
            🔒 Lock Teacher Mode
          </button>
          <button className="btn-game bg-rose-500 px-4 py-2 text-base" onClick={onClose}>
            ✖ Close
          </button>
        </div>

        {/* Approvals table */}
        <h3 className="mb-2 text-xl font-bold">✅ Approve tasks & award XP</h3>
        {state.teams.length === 0 ? (
          <p className="mb-4 text-white/60">No teams registered yet.</p>
        ) : (
          <div className="mb-6 overflow-x-auto rounded-2xl border-2 border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-2 text-left">Team</th>
                  {COLS.map((c) => (
                    <th key={c.key} className="p-2">
                      {c.label}
                      <div className="text-xs text-yellow-300">+{XP_VALUES[c.key]}</div>
                    </th>
                  ))}
                  <th className="p-2">Extra XP</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {state.teams.map((t) => (
                  <tr key={t.id} className="border-t border-white/10">
                    <td className="p-2 font-bold">
                      {t.emoji} {t.name}
                    </td>
                    {COLS.map((c) => {
                      const on = !!t.approvals[c.key];
                      return (
                        <td key={c.key} className="p-1 text-center">
                          <button
                            className={`h-10 w-10 rounded-xl text-xl font-bold ${on ? "bg-emerald-500" : "bg-white/10 hover:bg-white/20"}`}
                            onClick={() => {
                              approve(c.key, !on, t.id);
                              if (!on) {
                                sfx.xp();
                                if (c.key.startsWith("bonus")) celebrate(BADGES.find((b) => b.key === c.key)!.name + " bonus!", XP_VALUES[c.key], t.name);
                              } else sfx.uncheck();
                            }}
                          >
                            {on ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="h-9 w-9 rounded-lg bg-rose-500 font-bold" onClick={() => updateTeam(t.id, { extra: t.extra - 10 })}>
                          −
                        </button>
                        <span className="w-10 text-center font-bold">{t.extra}</span>
                        <button className="h-9 w-9 rounded-lg bg-emerald-500 font-bold" onClick={() => { sfx.xp(); updateTeam(t.id, { extra: t.extra + 10 }); }}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center font-title text-lg font-extrabold text-yellow-300">
                      {teamXp(t)}
                      <span className="text-xs text-white/50">/{MAX_XP}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {/* Answers key */}
          <div className="rounded-2xl bg-white/5 p-4">
            <h3 className="mb-2 text-xl font-bold">🔍 Level 1 secret words (answer key)</h3>
            <p className="mb-2 text-sm text-white/60">These words are hidden in the practice document. Change them, then re-download the document.</p>
            <div className="flex flex-wrap gap-2">
              {words.map((w, i) => (
                <input
                  key={i}
                  value={w}
                  onChange={(e) => setWords(words.map((x, j) => (j === i ? e.target.value.toUpperCase() : x)))}
                  className="w-32 rounded-xl bg-white px-3 py-2 font-bold uppercase text-slate-900"
                />
              ))}
              <button className="btn-game bg-emerald-500 px-4 py-2 text-base" onClick={() => { setSecretWords(words.map((w) => w.trim() || "SECRET")); sfx.check(); }}>
                Save
              </button>
            </div>
            <p className="mt-3 text-sm">
              🍌 Level 2 answer: Word should report <b className="text-yellow-300">{bananaCount(state.secretWords)} replacements</b>.
            </p>
            <h4 className="mt-4 font-bold">Team answers:</h4>
            <ul className="mt-1 space-y-1 text-sm">
              {state.teams.map((t) => (
                <li key={t.id}>
                  {t.emoji} <b>{t.name}</b>: {t.answers.filter(Boolean).join(", ") || "—"} {t.submitted && "📨"} · 🍌 {t.bananaCount || "—"}
                </li>
              ))}
            </ul>
          </div>

          {/* Game controls */}
          <div className="space-y-3 rounded-2xl bg-white/5 p-4">
            <h3 className="text-xl font-bold">⚙️ Game controls</h3>
            <label className="flex cursor-pointer items-center gap-3 text-lg">
              <input type="checkbox" className="h-6 w-6" checked={state.unlockAll} onChange={(e) => setUnlockAll(e.target.checked)} />
              🔓 Unlock all levels for every team
            </label>
            <button className="btn-game w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-amber-950" onClick={() => { onClose(); go("victory"); }} disabled={state.teams.length === 0}>
              🏆 Finish game & show winners
            </button>
            <button className="btn-game w-full bg-sky-600" onClick={() => { if (confirm("Reset all XP but keep the same teams?")) { restart(true); onClose(); } }}>
              🔁 Reset scores (keep teams)
            </button>
            <button className="btn-game w-full bg-rose-600" onClick={() => { if (confirm("Start a brand new classroom session?")) { restart(false); onClose(); } }}>
              🗑️ New session (clear everything)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
