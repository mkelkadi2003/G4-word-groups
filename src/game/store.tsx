import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sfx } from "./sound";

export type Screen = "intro" | "countdown" | "teams" | "map" | "level1" | "level2" | "level3" | "leaderboard" | "victory";

export type ApprovalKey = "l1" | "l2a" | "l2b" | "l2c" | "l3" | "bonusTeam" | "bonusSpeed";

export const XP_VALUES: Record<ApprovalKey, number> = {
  l1: 100,
  l2a: 50,
  l2b: 50,
  l2c: 50,
  l3: 200,
  bonusTeam: 50,
  bonusSpeed: 50,
};
export const MAX_XP = 550;

export type Team = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  approvals: Partial<Record<ApprovalKey, boolean>>;
  checks: Record<string, boolean>;
  answers: string[];
  submitted: boolean;
  bananaCount: string;
  extra: number;
};

export type GameState = {
  screen: Screen;
  teams: Team[];
  activeId: string | null;
  secretWords: string[];
  unlockAll: boolean;
};

export const TEAM_COLORS = ["#f43f5e", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];
export const TEAM_EMOJIS = ["🦁", "🐉", "🦄", "🚀", "🦊", "🐬", "🐯", "🦉", "⚡", "🌟", "🐼", "🤖"];

export const BADGES: { key: ApprovalKey; name: string; icon: string }[] = [
  { key: "l1", name: "Read Mode Ranger", icon: "📖" },
  { key: "l2a", name: "Banana Buster", icon: "🍌" },
  { key: "l2b", name: "Style Star", icon: "🎨" },
  { key: "l2c", name: "Web Explorer", icon: "🌐" },
  { key: "l3", name: "Printing Pro", icon: "🖨️" },
  { key: "bonusTeam", name: "Team Heroes", icon: "🤝" },
  { key: "bonusSpeed", name: "Speed Racers", icon: "⚡" },
];

const STORAGE = "maya-word-levelup-v1";

const initial: GameState = {
  screen: "intro",
  teams: [],
  activeId: null,
  secretWords: ["WIZARD", "RAINBOW", "TREASURE"],
  unlockAll: false,
};

export function teamXp(t: Team) {
  let xp = t.extra;
  (Object.keys(XP_VALUES) as ApprovalKey[]).forEach((k) => {
    if (t.approvals[k]) xp += XP_VALUES[k];
  });
  return Math.max(0, xp);
}

export function levelDone(t: Team, level: 1 | 2 | 3) {
  if (level === 1) return !!t.approvals.l1;
  if (level === 2) return !!(t.approvals.l2a && t.approvals.l2b && t.approvals.l2c);
  return !!t.approvals.l3;
}

export function levelUnlocked(t: Team, level: 1 | 2 | 3, unlockAll: boolean) {
  if (unlockAll || level === 1) return true;
  if (level === 2) return levelDone(t, 1);
  return levelDone(t, 2);
}

export function isMaster(t: Team) {
  return levelDone(t, 1) && levelDone(t, 2) && levelDone(t, 3);
}

export type Celebration = { id: number; title: string; xp?: number; sub?: string } | null;

type Ctx = {
  state: GameState;
  active: Team | null;
  teacher: boolean;
  setTeacher: (v: boolean) => void;
  celebration: Celebration;
  celebrate: (title: string, xp?: number, sub?: string) => void;
  go: (s: Screen) => void;
  setTeams: (names: { name: string; emoji: string }[]) => void;
  setActive: (id: string) => void;
  toggleCheck: (key: string) => void;
  approve: (key: ApprovalKey, value?: boolean, teamId?: string) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  setSecretWords: (w: string[]) => void;
  setUnlockAll: (v: boolean) => void;
  restart: (keepTeams?: boolean) => void;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return { ...initial, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return initial;
  });
  const [teacher, setTeacher] = useState(false);
  const [celebration, setCelebration] = useState<Celebration>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }, [state]);

  const celebrate = useCallback((title: string, xp?: number, sub?: string) => {
    const id = Date.now();
    setCelebration({ id, title, xp, sub });
    sfx.success();
    if (xp) setTimeout(() => sfx.xp(), 500);
    setTimeout(() => setCelebration((c) => (c && c.id === id ? null : c)), 3200);
  }, []);

  const go = useCallback((screen: Screen) => {
    sfx.whoosh();
    setState((s) => ({ ...s, screen }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setTeams = useCallback((list: { name: string; emoji: string }[]) => {
    const teams: Team[] = list.map((t, i) => ({
      id: `t${Date.now()}${i}`,
      name: t.name,
      emoji: t.emoji,
      color: TEAM_COLORS[i % TEAM_COLORS.length],
      approvals: {},
      checks: {},
      answers: ["", "", ""],
      submitted: false,
      bananaCount: "",
      extra: 0,
    }));
    setState((s) => ({ ...s, teams, activeId: teams[0]?.id ?? null }));
  }, []);

  const setActive = useCallback((id: string) => setState((s) => ({ ...s, activeId: id })), []);

  const updateTeam = useCallback((id: string, patch: Partial<Team>) => {
    setState((s) => ({ ...s, teams: s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const toggleCheck = useCallback((key: string) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => {
        if (t.id !== s.activeId) return t;
        const v = !t.checks[key];
        if (v) sfx.check();
        else sfx.uncheck();
        return { ...t, checks: { ...t.checks, [key]: v } };
      }),
    }));
  }, []);

  const approve = useCallback((key: ApprovalKey, value = true, teamId?: string) => {
    setState((s) => {
      const id = teamId ?? s.activeId;
      return { ...s, teams: s.teams.map((t) => (t.id === id ? { ...t, approvals: { ...t.approvals, [key]: value } } : t)) };
    });
  }, []);

  const setSecretWords = useCallback((w: string[]) => setState((s) => ({ ...s, secretWords: w })), []);
  const setUnlockAll = useCallback((v: boolean) => setState((s) => ({ ...s, unlockAll: v })), []);

  const restart = useCallback((keepTeams = false) => {
    setState((s) => {
      if (!keepTeams) return { ...initial, secretWords: s.secretWords };
      return {
        ...s,
        screen: "map",
        teams: s.teams.map((t) => ({ ...t, approvals: {}, checks: {}, answers: ["", "", ""], submitted: false, bananaCount: "", extra: 0 })),
        activeId: s.teams[0]?.id ?? null,
      };
    });
  }, []);

  const active = useMemo(() => state.teams.find((t) => t.id === state.activeId) ?? null, [state.teams, state.activeId]);

  const value: Ctx = {
    state,
    active,
    teacher,
    setTeacher,
    celebration,
    celebrate,
    go,
    setTeams,
    setActive,
    toggleCheck,
    approve,
    updateTeam,
    setSecretWords,
    setUnlockAll,
    restart,
  };
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame must be inside GameProvider");
  return c;
}
