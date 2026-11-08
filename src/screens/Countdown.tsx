import { useEffect, useState } from "react";
import { useGame } from "../game/store";
import { sfx } from "../game/sound";

export default function Countdown() {
  const { go } = useGame();
  const [n, setN] = useState(3);

  useEffect(() => {
    if (n > 0) sfx.countdown();
    else sfx.go();
    const t = setTimeout(() => {
      if (n > 0) setN(n - 1);
      else go("teams");
    }, 1000);
    return () => clearTimeout(t);
  }, [n, go]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-2xl font-bold text-white/80">🧙 Get ready, Word Wizards...</div>
      <div key={n} className={`anim-count font-title text-[12rem] font-extrabold leading-none md:text-[16rem] ${n === 0 ? "text-green-400" : "text-yellow-300"}`}>
        {n === 0 ? "GO!" : n}
      </div>
    </div>
  );
}
