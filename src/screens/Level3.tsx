import { useState } from "react";
import Maya from "../components/Maya";
import { ApproveButton, Checklist, CountdownTimer, Kbd, MissionCard, StoryBubble, useChecklistDone } from "../components/ui";
import { useGame } from "../game/store";

const STEPS = [
  { key: "preview", text: <>Press <Kbd>Ctrl</Kbd>+<Kbd>P</Kbd> to open <b>Print Preview</b>.</>, tip: "Or click File → Print." },
  { key: "portrait", text: <>Set the orientation to <b>Portrait</b> 📄 (tall page).</> },
  { key: "custom", text: <>Choose <b>Custom Print</b> and type <b>1</b> in Pages.</>, tip: "Click “Print All Pages” to see the Custom Print option." },
  { key: "copies", text: <>Set <b>Copies</b> to <b>2</b>.</> },
  { key: "show", text: <>Call your teacher 🙋 and show your <b>perfect Print Preview</b>!</>, tip: "Don't click Print unless your teacher says so – save paper! 🌳" },
];

function Printer({ printing }: { printing: boolean }) {
  return (
    <div className="relative mx-auto h-56 w-64">
      {printing && (
        <div className="absolute left-1/2 top-[120px] z-0 w-36 -translate-x-1/2 overflow-hidden" style={{ height: 120 }}>
          <div className="anim-paper rounded-b-md bg-white p-2 shadow-lg">
            <div className="mb-1 h-2 w-3/4 rounded bg-fuchsia-500" />
            {[...Array(6)].map((_, i) => <div key={i} className="mb-1 h-1.5 rounded bg-slate-300" />)}
            <div className="text-center text-xs font-bold text-emerald-600">✓ PAGE 1</div>
          </div>
        </div>
      )}
      <div className="absolute left-1/2 top-0 h-14 w-36 -translate-x-1/2 rounded-t-lg bg-white/90" />
      <div className="absolute left-1/2 top-12 z-10 h-24 w-60 -translate-x-1/2 rounded-3xl bg-gradient-to-b from-slate-300 to-slate-500 shadow-2xl">
        <div className="absolute right-5 top-4 flex gap-2">
          <span className={`h-4 w-4 rounded-full ${printing ? "bg-green-400 anim-glow" : "bg-red-500 anim-pulse-red"}`} />
          <span className="h-4 w-4 rounded-full bg-yellow-400" />
        </div>
        <div className="absolute left-5 top-4 rounded bg-slate-800 px-2 py-1 font-mono text-xs text-green-300">{printing ? "PRINTING x2" : "READY?"}</div>
        <div className="absolute bottom-3 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

export default function Level3() {
  const { active, approve, go, state } = useGame();
  const ready = useChecklistDone("l3", STEPS.map((s) => s.key));
  const [bossLeft, setBossLeft] = useState(180);
  const [bossStarted, setBossStarted] = useState(false);
  if (!active) return null;
  const done = !!active.approvals.l3;

  const cards = [
    { icon: "⌨️", t: "Print Preview", d: <><Kbd>Ctrl</Kbd>+<Kbd>P</Kbd></> },
    { icon: "📄", t: "Portrait", d: <span className="flex items-end justify-center gap-3"><span className="inline-block h-12 w-9 rounded border-4 border-emerald-400 bg-white" /><span className="inline-block h-9 w-12 rounded border-4 border-white/30 bg-white/40 line-through" /></span> },
    { icon: "🔢", t: "Page 1 only", d: <span className="rounded-lg bg-white px-3 py-1 font-mono text-lg font-bold text-slate-900">Pages: 1</span> },
    { icon: "📑", t: "2 Copies", d: <span className="rounded-lg bg-white px-3 py-1 font-mono text-lg font-bold text-slate-900">Copies: 2 ▲▼</span> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="anim-slide mb-6 rounded-[2rem] bg-gradient-to-r from-orange-500 via-red-600 to-rose-700 p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <Maya mood={done ? "excited" : "happy"} size={130} className="anim-float shrink-0" />
          <div className="flex-1">
            <div className="text-lg font-bold uppercase tracking-widest text-orange-100">Level 3 · Print Preview & Settings · 200 XP</div>
            <h1 className="font-title text-4xl font-extrabold md:text-6xl">🖨️ The Printing Pro!</h1>
            <div className="mt-3 max-w-2xl">
              <StoryBubble>"My newsletter is finally ready! 🎉 But Mom says: <b>print it correctly without wasting paper!</b> 🌳"</StoryBubble>
            </div>
          </div>
          <Printer printing={done} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="card-game anim-pop text-center" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="text-sm font-bold text-orange-200">CHALLENGE {i + 1}</div>
            <div className="text-5xl">{c.icon}</div>
            <div className="font-title text-xl font-extrabold">{c.t}</div>
            <div className="mt-2 flex min-h-[3rem] items-center justify-center">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MissionCard title="Printing Checklist" icon="📋" accent="from-orange-500 to-amber-600">
          <Checklist prefix="l3" items={STEPS} />
        </MissionCard>

        <div className="space-y-4">
          <div className={`rounded-[2rem] border-4 border-red-500 bg-gradient-to-br from-red-900 via-rose-900 to-black p-6 text-center shadow-2xl ${!done ? "anim-pulse-red" : ""}`}>
            <div className="text-7xl anim-wiggle">{done ? "🏆" : "🔥"}</div>
            <h2 className="font-title text-4xl font-extrabold text-red-300 md:text-5xl">{done ? "BOSS DEFEATED!" : "FINAL BOSS!"}</h2>
            <p className="mt-2 text-xl font-semibold">
              {done ? "Amazing printing, Wizards! Maya's newsletter is perfect! 🎉" : "Your document is almost ready! Show your teacher your perfect Print Preview screen before the countdown reaches zero!"}
            </p>
          </div>
          {!done && (
            <CountdownTimer
              seconds={180}
              label="Boss countdown"
              danger
              onTick={(l) => {
                setBossLeft(l);
                if (l < 180) setBossStarted(true);
              }}
            />
          )}
          <ApproveButton
            k="l3"
            label="Approve Print Preview – Defeat the Boss"
            successTitle="FINAL BOSS DEFEATED! Printing Pros! 🖨️"
            ready={ready}
            onApproved={() => {
              if (bossStarted && bossLeft > 0 && !active.approvals.bonusSpeed) approve("bonusSpeed", true);
            }}
          />
          {!done && <p className="text-center text-sm text-white/60">⚡ Beat the boss countdown to win the <b>+50 Speed Bonus</b>!</p>}
          {done && (
            <div className="anim-pop space-y-3 text-center">
              {active.approvals.bonusSpeed && <div className="rounded-2xl bg-yellow-400 px-4 py-2 text-xl font-extrabold text-purple-900">⚡ Speed Bonus +50 XP!</div>}
              <div className="flex flex-wrap justify-center gap-3">
                <button className="btn-game bg-amber-500 text-amber-950" onClick={() => go("leaderboard")}>🏆 Leaderboard</button>
                {state.teams.every((t) => t.approvals.l3) && (
                  <button className="btn-game bg-gradient-to-r from-yellow-400 to-pink-500 text-2xl anim-glow" onClick={() => go("victory")}>👑 Final Victory!</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
