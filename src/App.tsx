import TopBar from "./components/TopBar";
import { CelebrationOverlay, StarsBg } from "./components/ui";
import { GameProvider, useGame } from "./game/store";
import Countdown from "./screens/Countdown";
import Intro from "./screens/Intro";
import Leaderboard from "./screens/Leaderboard";
import Level1 from "./screens/Level1";
import Level2 from "./screens/Level2";
import Level3 from "./screens/Level3";
import MapScreen from "./screens/MapScreen";
import Teams from "./screens/Teams";
import Victory from "./screens/Victory";

function Router() {
  const { state } = useGame();
  const needsTeams = state.teams.length === 0 && !["intro", "countdown", "teams"].includes(state.screen);
  const screen = needsTeams ? "intro" : state.screen;

  return (
    <div key={screen} className="anim-slide">
      {screen === "intro" && <Intro />}
      {screen === "countdown" && <Countdown />}
      {screen === "teams" && <Teams />}
      {screen === "map" && <MapScreen />}
      {screen === "level1" && <Level1 />}
      {screen === "level2" && <Level2 />}
      {screen === "level3" && <Level3 />}
      {screen === "leaderboard" && <Leaderboard />}
      {screen === "victory" && <Victory />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <StarsBg />
      <TopBar />
      <main className="pb-10">
        <Router />
      </main>
      <footer className="pb-4 text-center text-sm text-white/50">
        Al-Bassam Schools · مدارس البسام · Grade 4 ICT · Microsoft Word Level-Up Challenge
      </footer>
      <CelebrationOverlay />
    </GameProvider>
  );
}
