import Maya from "../components/Maya";
import MessyDoc from "../components/MessyDoc";
import { ApproveButton, Checklist, CountdownTimer, Kbd, MissionCard, StoryBubble, useChecklistDone } from "../components/ui";
import { downloadNewsletter } from "../game/newsletter";
import { sfx } from "../game/sound";
import { useGame } from "../game/store";

const STEPS = [
  { key: "open", text: <>Open <b>Maya's Newsletter</b> in Microsoft Word.</>, tip: "Use the blue download button if you don't have it." },
  { key: "view", text: <>Click the <b>View</b> tab at the top of Word.</> },
  { key: "print", text: <>Click <b>Print Layout</b>. See the pages like real paper? 📄</> },
  { key: "read", text: <>Click <b>Read Mode</b>. Now it looks like a book! 📖</>, tip: "Use the arrows ◀ ▶ to turn the pages." },
  { key: "back", text: <>Press <Kbd>Esc</Kbd> to go back to Print Layout.</> },
];

export default function Level1() {
  const { state, active, updateTeam, teacher, go } = useGame();
  const ready = useChecklistDone("l1", STEPS.map((s) => s.key));
  if (!active) return null;

  const answers = active.answers.length === 3 ? active.answers : ["", "", ""];
  const correct = (i: number) => answers[i].trim().toUpperCase() !== "" && state.secretWords.map((w) => w.toUpperCase()).includes(answers[i].trim().toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Banner */}
      <div className="anim-slide mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <Maya mood="worried" size={130} className="anim-float shrink-0" />
          <div className="flex-1">
            <div className="text-lg font-bold uppercase tracking-widest text-sky-100">Level 1 · Views & Read Mode · 100 XP</div>
            <h1 className="font-title text-4xl font-extrabold md:text-6xl">🚑 Emergency Rescue!</h1>
            <div className="mt-3 max-w-2xl">
              <StoryBubble>"My newsletter is impossible to read! 😫 Help me find the <b>best way to view</b> my document!"</StoryBubble>
            </div>
          </div>
          <MessyDoc className="hidden lg:block" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MissionCard title="Mission: Explore the Views" icon="👀">
          <button className="btn-game mb-4 w-full bg-blue-500 text-lg" onClick={() => { sfx.check(); downloadNewsletter(state.secretWords); }}>
            📥 Download Maya's Newsletter (.doc)
          </button>
          <Checklist prefix="l1" items={STEPS} />
        </MissionCard>

        <MissionCard title="What's the difference?" icon="🤔" accent="from-violet-500 to-purple-700">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 text-slate-800">
              <div className="mb-2 font-title text-xl font-extrabold text-blue-700">📄 Print Layout</div>
              <div className="mx-auto mb-3 flex h-32 w-24 flex-col gap-1.5 rounded border-2 border-slate-300 bg-white p-2 shadow-lg">
                <div className="h-2 w-3/4 rounded bg-blue-500" />
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-1.5 rounded bg-slate-300" />
                ))}
              </div>
              <ul className="space-y-1 text-base">
                <li>✏️ For <b>typing and editing</b></li>
                <li>📏 Shows pages like real paper</li>
                <li>🖨️ What you see is what prints</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-4 text-slate-800">
              <div className="mb-2 font-title text-xl font-extrabold text-purple-700">📖 Read Mode</div>
              <div className="mx-auto mb-3 flex h-32 gap-1 rounded bg-amber-50 p-2 shadow-lg">
                {[0, 1].map((c) => (
                  <div key={c} className="flex flex-1 flex-col gap-1.5">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="h-1.5 rounded bg-slate-400" />
                    ))}
                  </div>
                ))}
              </div>
              <ul className="space-y-1 text-base">
                <li>👓 For <b>reading only</b></li>
                <li>📚 Looks like a book with columns</li>
                <li>🚫 No typing, no menus</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-yellow-300/20 p-3 text-lg">
            💡 <b>Shortcut:</b> Look at the little icons at the <b>bottom-right</b> of Word to switch views fast!
          </div>
        </MissionCard>
      </div>

      {/* Secret word challenge */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <div className="card-game border-yellow-300/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
            <div className="text-6xl anim-wiggle">🕵️</div>
            <h2 className="font-title text-3xl font-extrabold text-yellow-300">Secret Word Hunt!</h2>
            <p className="text-lg">Use <b>Read Mode</b> to turn the pages. Find the <b>3 hidden secret words</b> before time runs out!</p>
          </div>
          <CountdownTimer seconds={300} label="Word hunt timer" />
        </div>

        <MissionCard title="Team Answers" icon="🔑" accent="from-amber-500 to-orange-600">
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center">
                <div className="mb-1 font-bold">Secret word {i + 1}</div>
                <div className="relative">
                  <input
                    value={answers[i]}
                    disabled={active.submitted && !teacher}
                    onChange={(e) => updateTeam(active.id, { answers: answers.map((a, j) => (j === i ? e.target.value.toUpperCase() : a)) })}
                    placeholder="? ? ?"
                    className="w-full rounded-2xl border-4 border-dashed border-yellow-300 bg-white px-3 py-4 text-center font-title text-2xl font-extrabold uppercase tracking-wider text-slate-900 outline-none focus:border-solid"
                  />
                  {teacher && answers[i] && <span className="absolute -right-2 -top-2 text-2xl">{correct(i) ? "✅" : "❌"}</span>}
                </div>
              </div>
            ))}
          </div>

          {!active.submitted ? (
            <button
              className="btn-game mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-600 text-2xl"
              disabled={answers.some((a) => !a.trim())}
              onClick={() => {
                sfx.whoosh();
                updateTeam(active.id, { submitted: true });
              }}
            >
              📨 Submit Our Answers
            </button>
          ) : (
            <div className="mt-4 rounded-2xl bg-sky-500/30 p-3 text-center text-xl font-bold anim-pop">
              📨 Answers sent! Raise your hands 🙋 for the teacher to check.
              {teacher && !active.approvals.l1 && (
                <button className="ml-2 text-sm underline" onClick={() => updateTeam(active.id, { submitted: false })}>
                  Let team edit
                </button>
              )}
            </div>
          )}

          {teacher && (
            <div className="mt-3 rounded-xl bg-black/30 p-2 text-sm text-white/70">
              👩‍🏫 Answer key: <b className="text-yellow-300">{state.secretWords.join(" · ")}</b>
            </div>
          )}

          <div className="mt-4">
            <ApproveButton k="l1" label="Confirm answers & complete Level 1" successTitle="Level 1 Complete! Read Mode Rangers! 📖" ready={ready && active.submitted} />
          </div>
          {active.approvals.l1 && (
            <button className="btn-game mt-4 w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-2xl anim-pop" onClick={() => go("level2")}>
              🔓 Next: Level 2 – Style Makeover ➜
            </button>
          )}
        </MissionCard>
      </div>
    </div>
  );
}
