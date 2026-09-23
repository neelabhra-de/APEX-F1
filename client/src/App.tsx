import CinematicExperience from './components/cinematic/CinematicExperience'
import TribesSection from './sections/tribes/TribesSection'
import GridSection from './sections/grid/GridSection'
import ChampionshipSection from './sections/championship/ChampionshipSection'
import LastRaceSection from './sections/last-race/LastRaceSection'
import GlobalMenu from './components/GlobalMenu'

function App() {
  return (
    <main>
      <GlobalMenu />
      <div id="machines"><CinematicExperience /></div>
      <TribesSection />
      <GridSection />
      <ChampionshipSection />
      <LastRaceSection />
    </main>
  )
}

export default App
