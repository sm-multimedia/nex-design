import Canvas from './canvas';
import DesignGallery from './pages/DesignGallery';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import { useSnapshot } from 'valtio';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  return (
    <main className="app transition-all ease-in">
      {snap.gallery ? (
        <DesignGallery />
      ) : (
        <>
          <Home />
          <Canvas />
          <Customizer />
        </>
      )}
    </main>
  )
}

export default App
