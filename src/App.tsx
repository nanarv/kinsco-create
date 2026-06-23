import { useState } from 'react'
import { BuildFlow } from './components/BuildFlow'

type Screen = 'build' | 'gallery'

function App() {
  const [screen, setScreen] = useState<Screen>('build')

  if (screen === 'gallery') {
    return (
      <main>
        <h1>Gallery</h1>
      </main>
    )
  }

  return <BuildFlow onSubmitted={() => setScreen('gallery')} />
}

export default App
