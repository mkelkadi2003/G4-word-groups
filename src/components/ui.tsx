import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { sfx } from "../game/sound";
import { useGame, type ApprovalKey, XP_VALUES } from "../game/store";

/* ---------------- Background stars ---------------- */
export function StarsBg() {
  const stars = useMemo(
    () =>
      Array.from({ length: 45 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animation: `twinkle 3s ${s.delay}s infinite` }}
        />
      ))}
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  );
}

/* ---------------- Confetti ---------------- */
export function Confetti({ count = 120 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 3 + Math.random() * 3,
        color: ["#f43f5e", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#fb923c", "#ffffff"][Math.floor(Math.random() * 7)],
        w: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 200,
        round: Math.random() > 0.6,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.round ? p.w : p.w * 1.6,
              background: p.color,
              borderRadius: p.round ? "50%" : 2,
              animation: `confetti-fall ${p.dur}s ${p.delay}s linear infinite`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------------- Animated number ---------------- */
export function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      const v = Math.round(start + diff * (1 - Math.pow(1 - p, 3)));
      setShown(v);
      ref.current = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

/* ---------------- Countdown timer ---------------- */
export function CountdownTimer({
  seconds,
  label = "Countdown",
  danger = false,
  onEnd,
  autoStart = false,
  onTick,
}: {
  seconds: number;
  label?: string;
  danger?: boolean;
  onEnd?: () => void;
  autoStart?: boolean;
  onTick?: (left: number) => void;
}) {
  const [total, setTotal] = useState(seconds);
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((l) => {
        const n = l - 1;
        if (n <= 10 && n > 0) sfx.tick();
        if (n <= 0) {
          setRunning(false);
          sfx.alarm();
          endRef.current?.();
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    tickRef.current?.(left);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = (left / total) * 100;
  const low = left <= 10;

  return (
    <div className={`card-game text-center ${danger ? "border-red-400/60 bg-red-900/30" : ""} ${low && running ? "anim-pulse-red" : ""}`}>
      <div className="text-sm font-bold uppercase tracking-widest text-white/70">⏱️ {label}</div>
      <div className={`font-title text-6xl font-extrabold tabular-nums md:text-7xl ${left === 0 ? "text-red-400 anim-shake" : low ? "text-red-400" : "text-yellow-300"}`}>
        {mm}:{ss}
      </div>
      <div className="mx-auto my-3 h-3 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${low ? "bg-red-500" : pct < 50 ? "bg-orange-400" : "bg-green-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {left === 0 && <div className="mb-2 text-xl font-bold text-red-300">⏰ TIME'S UP!</div>}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className={`btn-game text-base ${running ? "bg-orange-500" : "bg-green-500"}`}
          onClick={() => {
            sfx.click();
            if (left === 0) setLeft(total);
            setRunning((r) => !r);
          }}
        >
          {running ? "⏸ Pause" : left === total ? "▶ Start" : left === 0 ? "🔁 Restart" : "▶ Resume"}
        </button>
        <button
          className="btn-game bg-slate-600 text-base"
          onClick={() => {
            sfx.click();
            setRunning(false);
            setLeft(total);
          }}
        >
          ↺ Reset
        </button>
        <select
          className="rounded-xl bg-slate-700 px-2 text-base font-bold"
          value={total}
          onChange={(e) => {
            const v = Number(e.target.value);
            setTotal(v);
            setLeft(v);
            setRunning(false);
          }}
          aria-label="Timer length"
        >
          {[60, 120, 180, 300, 420, 600].map((s) => (
            <option key={s} value={s}>
              {s / 60} min
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ---------------- Checklist ---------------- */
export function Checklist({ items, prefix }: { items: { key: string; text: ReactNode; tip?: string }[]; prefix: string }) {
  const { active, toggleCheck } = useGame();
  const done = items.filter((i) => active?.checks[`${prefix}.${i.key}`]).length;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-white/80">
        <span>✅ Team checklist</span>
        <span>
          {done}/{items.length}
        </span>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/30">
        <div className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map((it, idx) => {
          const k = `${prefix}.${it.key}`;
          const on = !!active?.checks[k];
          return (
            <li key={k}>
              <button
                onClick={() => toggleCheck(k)}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left text-lg transition-all ${
                  on ? "border-emerald-400 bg-emerald-500/25" : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-lg font-bold ${
                    on ? "anim-pop border-emerald-300 bg-emerald-400 text-emerald-950" : "border-white/40"
                  }`}
                >
                  {on ? "✓" : idx + 1}
                </span>
                <span className={on ? "text-emerald-100" : ""}>
                  {it.text}
                  {it.tip && <span className="mt-1 block text-sm text-white/60">💡 {it.tip}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function useChecklistDone(prefix: string, keys: string[]) {
  const { active } = useGame();
  return keys.every((k) => active?.checks[`${prefix}.${k}`]);
}

/* ---------------- Teacher approve button ---------------- */
export function ApproveButton({
  k,
  label,
  successTitle,
  ready = true,
  onApproved,
  xpOverride,
}: {
  k: ApprovalKey;
  label: string;
  successTitle: string;
  ready?: boolean;
  onApproved?: () => void;
  xpOverride?: number;
}) {
  const { active, teacher, approve, celebrate, setTeacher } = useGame();
  if (!active) return null;
  const done = !!active.approvals[k];
  const xp = xpOverride ?? XP_VALUES[k];
  if (done) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="anim-pop rounded-2xl bg-emerald-500 px-5 py-3 font-title text-xl font-extrabold text-white shadow-lg">
          ✅ Approved! +{xp} XP
        </div>
        {teacher && (
          <button className="text-sm text-white/60 underline" onClick={() => approve(k, false)}>
            Undo
          </button>
        )}
      </div>
    );
  }
  return (
    <div>
      <button
        className={`btn-game w-full ${teacher ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 anim-glow" : "bg-slate-600 text-white"}`}
        onClick={() => {
          if (!teacher) {
            sfx.fail();
            setTeacher(true);
            return;
          }
          approve(k, true);
          celebrate(successTitle, xp, active.name);
          onApproved?.();
        }}
      >
        {teacher ? `👩‍🏫 ${label} (+${xp} XP)` : "🔒 Teacher approval needed – tap to unlock Teacher Mode"}
      </button>
      {teacher && !ready && <p className="mt-2 text-center text-sm text-yellow-200">⚠️ The team has not ticked every step yet.</p>}
    </div>
  );
}

/* ---------------- Celebration overlay ---------------- */
export function CelebrationOverlay() {
  const { celebration } = useGame();
  if (!celebration) return null;
  return (
    <div key={celebration.id} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Confetti count={90} />
      <div className="anim-pop relative mx-4 rounded-[2rem] border-4 border-yellow-300 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-800 px-10 py-8 text-center shadow-2xl">
        <div className="mb-2 text-7xl anim-float">🌟</div>
        <div className="font-title text-4xl font-extrabold text-yellow-300 md:text-6xl">SUCCESS!</div>
        <div className="mt-2 text-2xl font-bold md:text-3xl">{celebration.title}</div>
        {celebration.sub && <div className="mt-1 text-xl text-white/80">Team {celebration.sub}</div>}
        {celebration.xp ? (
          <div className="mt-4 inline-block rounded-full bg-yellow-400 px-6 py-2 font-title text-4xl font-extrabold text-purple-900 anim-glow">
            +{celebration.xp} XP
          </div>
        ) : null}
        <div className="mt-3 text-3xl">⭐⭐⭐</div>
      </div>
    </div>
  );
}

/* ---------------- Mission card wrapper ---------------- */
export function MissionCard({ title, icon, children, accent = "from-sky-500 to-indigo-600", className = "" }: { title: string; icon: string; children: ReactNode; accent?: string; className?: string }) {
  return (
    <section className={`card-game anim-slide ${className}`}>
      <div className={`-mx-5 -mt-5 mb-4 flex items-center gap-3 rounded-t-[1.35rem] bg-gradient-to-r ${accent} px-5 py-3`}>
        <span className="text-3xl">{icon}</span>
        <h3 className="font-title text-2xl font-extrabold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="mx-0.5 inline-block rounded-lg border-b-4 border-slate-400 bg-white px-2.5 py-0.5 font-mono text-base font-bold text-slate-800">{children}</kbd>;
}

export function StoryBubble({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-3xl bg-white p-5 text-xl font-semibold text-slate-800 shadow-xl md:text-2xl">
      {children}
      <span className="absolute -left-3 top-8 h-6 w-6 rotate-45 bg-white" />
    </div>
  );
}
