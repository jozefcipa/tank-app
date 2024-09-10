import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TankContextProvider } from './tank/context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TankContextProvider>
      <App />
    </TankContextProvider>
  </StrictMode>,
)
