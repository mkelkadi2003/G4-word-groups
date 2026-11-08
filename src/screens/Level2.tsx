import { useMemo, useState } from "react";
import Maya from "../components/Maya";
import { ApproveButton, Checklist, Kbd, MissionCard, StoryBubble, useChecklistDone } from "../components/ui";
import { sfx } from "../game/sound";
import { useGame } from "../game/store";

const A_STEPS = [
  { key: "open", text: <>Press <Kbd>Ctrl</Kbd>+<Kbd>H</Kbd> to open <b>Find and Replace</b>.</>, tip: "Or: Home tab → Replace (far right)." },
  { key: "find", text: <>In <b>Find what</b>, type: <b className="text-yellow-300">BANANA</b></> },
  { key: "replace", text: <>In <b>Replace with</b>, type: <b className="text-emerald-300">BOOK</b></> },
  { key: "all", text: <>Click <b>Replace All</b> 🪄</> },
  { key: "check", text: <>Check the document: no more bananas! 🍌🚫</> },
];
const B_STEPS = [
  { key: "select", text: <>Select the title <b>"maya's school newsletter"</b> with your mouse.</>, tip: "Click and drag over the words to highlight them." },
  { key: "font", text: <>Go to the <b>Home</b> tab and change the <b>Font</b> (try a fun one!).</> },
  { key: "bold", text: <>Make it <b>Bold</b>. Click <b className="rounded bg-white px-2 text-slate-900">B</b> or press <Kbd>Ctrl</Kbd>+<Kbd>B</Kbd>.</> },
  { key: "color", text: <>Click the <b className="underline decoration-red-500 decoration-4">A</b> <b>Font Color</b> button and pick a bright color.</> },
  { key: "size", text: <>⭐ Bonus: make the title <b>bigger</b> with Font Size.</> },
];
const C_STEPS = [
  { key: "view", text: <>Click the <b>View</b> tab.</> },
  { key: "web", text: <>Click <b>Web Layout</b> 🌐.</> },
  { key: "see", text: <>Look! No pages – it looks like a <b>website</b>.</> },
  { key: "back", text: <>Click <b>Print Layout</b> to go back.</> },
];

function BananaRain({ cleaned }: { cleaned: boolean }) {
  const items = useMemo(() => Array.from({ length: 18 }).map(() => ({ left: Math.random() * 90, delay: Math.random() * 3, dur: 2 + Math.random() * 2 })), []);
  return (
    <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-2xl bg-white p-4 text-slate-700 shadow-2xl">
      <div className="mb-2 font-bold">Library News</div>
      <p className="text-sm leading-relaxed">
        Our library has 500 new{" "}
        {["", " for all students. You can borrow a ", " every Monday. Please take care of every ", "!"].map((t, i) => (
          <span key={i}>
            {i > 0 && (
              <b className={`rounded px-1 ${cleaned ? "bg-emerald-200 text-emerald-800" : "bg-yellow-300 text-yellow-900 anim-wiggle inline-block"}`}>{cleaned ? "BOOK" : "BANANA"}</b>
            )}
            {t}
          </span>
        ))}
      </p>
      <p className="mt-2 text-sm">
        Grade 4 read 120 <b className={`rounded px-1 ${cleaned ? "bg-emerald-200 text-emerald-800" : "bg-yellow-300 text-yellow-900"}`}>{cleaned ? "BOOK" : "BANANA"}</b>s last term!
      </p>
      {!cleaned &&
        items.map((b, i) => (
          <span key={i} className="pointer-events-none absolute top-0 text-3xl" style={{ left: `${b.left}%`, animation: `banana-fall ${b.dur}s ${b.delay}s linear infinite` }}>
            🍌
          </span>
        ))}
      {cleaned && <div className="absolute bottom-3 right-3 text-5xl anim-pop">📚✨</div>}
    </div>
  );
}

export default function Level2() {
  const { active, updateTeam, go } = useGame();
  const [tab, setTab] = useState<"A" | "B" | "C">("A");
  const aReady = useChecklistDone("l2a", A_STEPS.map((s) => s.key));
  const bReady = useChecklistDone("l2b", B_STEPS.slice(0, 4).map((s) => s.key));
  const cReady = useChecklistDone("l2c", C_STEPS.map((s) => s.key));
  if (!active) return null;
  const ap = active.approvals;
  const allDone = ap.l2a && ap.l2b && ap.l2c;

  const tabs = [
    { id: "A" as const, icon: "🍌", t: "Banana Disaster", done: ap.l2a },
    { id: "B" as const, icon: "🎨", t: "Design Expert", done: ap.l2b },
    { id: "C" as const, icon: "🌐", t: "Website Preview", done: ap.l2c },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="anim-slide mb-6 rounded-[2rem] bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-700 p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <Maya mood="worried" size={130} className="anim-float shrink-0" />
          <div className="flex-1">
            <div className="text-lg font-bold uppercase tracking-widest text-pink-100">Level 2 · Find & Replace, Fonts, Web Layout · 150 XP</div>
            <h1 className="font-title text-4xl font-extrabold md:text-6xl">🎨 The Style Makeover!</h1>
            <div className="mt-3 max-w-2xl">
              <StoryBubble>
                "OH NO! 😱 I typed <b className="text-yellow-600">BANANA</b> everywhere instead of <b className="text-emerald-600">BOOK</b>! And my title looks soooo boring!"
              </StoryBubble>
            </div>
          </div>
          <div className="text-7xl anim-wiggle">🍌</div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { sfx.click(); setTab(t.id); }}
            className={`rounded-3xl border-4 p-4 text-left transition-all ${tab === t.id ? "scale-[1.03] border-yellow-300 bg-white/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{t.icon}</span>
              <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-bold">{t.done ? "✅ +50 XP" : "50 XP"}</span>
            </div>
            <div className="mt-1 text-sm font-bold text-white/70">Challenge {t.id}</div>
            <div className="font-title text-2xl font-extrabold">{t.t}</div>
          </button>
        ))}
      </div>

      {tab === "A" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <MissionCard title="Challenge A: The Banana Disaster!" icon="🍌" accent="from-yellow-400 to-amber-600">
            <p className="mb-3 text-xl">Bananas are taking over! 🍌🍌🍌 Use <b>Find and Replace</b> to change every <b>BANANA</b> into <b>BOOK</b>.</p>
            <Checklist prefix="l2a" items={A_STEPS} />
          </MissionCard>
          <div className="space-y-4">
            <div className="card-game" onClick={() => !ap.l2a && sfx.banana()}>
              <BananaRain cleaned={!!ap.l2a} />
              <p className="mt-3 text-center text-lg">{ap.l2a ? "🎉 Bananas busted! The books are back!" : "😱 Help! The bananas are everywhere!"}</p>
            </div>
            <div className="card-game">
              <label className="mb-2 block text-xl font-bold">🔢 How many replacements did Word make?</label>
              <input
                type="number"
                min={0}
                value={active.bananaCount}
                onChange={(e) => updateTeam(active.id, { bananaCount: e.target.value })}
                className="w-40 rounded-2xl border-4 border-yellow-300 bg-white px-4 py-3 text-center font-title text-3xl font-extrabold text-slate-900"
                placeholder="?"
              />
              <p className="mt-2 text-sm text-white/60">Word shows a message like “All done. We made __ replacements.”</p>
            </div>
            <ApproveButton k="l2a" label="Approve Banana Busters" successTitle="Banana Disaster Fixed! 🍌➡📚" ready={aReady} onApproved={() => setTab("B")} />
          </div>
        </div>
      )}

      {tab === "B" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <MissionCard title="Challenge B: Become a Design Expert!" icon="🎨" accent="from-pink-500 to-rose-600">
            <p className="mb-3 text-xl">Make Maya's title look <b>AMAZING</b>! ✨</p>
            <Checklist prefix="l2b" items={B_STEPS} />
          </MissionCard>
          <div className="space-y-4">
            <div className="card-game">
              <h3 className="mb-3 font-title text-2xl font-extrabold">Before ➜ After</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 text-slate-800">
                  <div className="mb-2 text-sm font-bold text-red-500">😴 BEFORE</div>
                  <div className="font-serif text-sm">maya's school newsletter</div>
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-800">
                  <div className="mb-2 text-sm font-bold text-emerald-600">🤩 AFTER</div>
                  <div className="font-title text-2xl font-extrabold text-fuchsia-600">Maya's School Newsletter</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white/10 p-3"><div className="text-3xl font-[cursive]">Aa</div><div className="font-bold">Font</div></div>
                <div className="rounded-2xl bg-white/10 p-3"><div className="text-3xl font-extrabold">B</div><div className="font-bold">Bold</div></div>
                <div className="rounded-2xl bg-white/10 p-3"><div className="text-3xl font-extrabold underline decoration-pink-500 decoration-8">A</div><div className="font-bold">Color</div></div>
              </div>
            </div>
            <ApproveButton k="l2b" label="Approve Design Experts" successTitle="Style Stars! The title looks awesome! 🎨" ready={bReady} onApproved={() => setTab("C")} />
          </div>
        </div>
      )}

      {tab === "C" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <MissionCard title="Challenge C: The Website Preview!" icon="🌐" accent="from-cyan-500 to-blue-600">
            <p className="mb-3 text-xl">Maya wants to put her newsletter on the <b>school website</b>. Let's see how it looks!</p>
            <Checklist prefix="l2c" items={C_STEPS} />
          </MissionCard>
          <div className="space-y-4">
            <div className="card-game">
              <h3 className="mb-3 font-title text-2xl font-extrabold">Print Layout vs Web Layout</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-300 p-3 text-slate-800">
                  <div className="mb-2 text-center font-bold text-blue-700">📄 Print Layout</div>
                  <div className="mx-auto flex h-36 w-28 flex-col gap-1.5 bg-white p-3 shadow-lg">
                    <div className="h-2.5 w-3/4 rounded bg-fuchsia-500" />
                    {[...Array(7)].map((_, i) => <div key={i} className="h-1.5 rounded bg-slate-300" />)}
                  </div>
                  <ul className="mt-2 text-sm"><li>📏 Pages with margins</li><li>🖨️ Ready to print</li></ul>
                </div>
                <div className="rounded-2xl bg-slate-300 p-3 text-slate-800">
                  <div className="mb-2 text-center font-bold text-cyan-700">🌐 Web Layout</div>
                  <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                    <div className="flex gap-1 bg-slate-200 p-1"><span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-yellow-400" /><span className="h-2 w-2 rounded-full bg-green-400" /></div>
                    <div className="flex h-[7.3rem] flex-col gap-1.5 p-2">
                      <div className="h-2.5 w-1/2 rounded bg-fuchsia-500" />
                      {[...Array(6)].map((_, i) => <div key={i} className="h-1.5 w-full rounded bg-slate-300" />)}
                    </div>
                  </div>
                  <ul className="mt-2 text-sm"><li>↔️ Text fills the screen</li><li>🚫 No page breaks</li></ul>
                </div>
              </div>
            </div>
            <ApproveButton k="l2c" label="Approve Web Explorers" successTitle="Web Explorers! 🌐" ready={cReady} />
          </div>
        </div>
      )}

      {allDone && (
        <div className="mt-6 text-center anim-pop">
          <button className="btn-game bg-gradient-to-r from-orange-500 to-red-600 px-10 text-2xl anim-glow" onClick={() => go("level3")}>
            🔓 Next: Level 3 – Printing Pro ➜
          </button>
        </div>
      )}
    </div>
  );
}
