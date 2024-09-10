import { createContext, ReactNode, useState } from 'react'
import { LightsState, TankState } from './types.ts'

interface ContextActions {
  setIsConnecting: (isConnecting: boolean) => void
  setIsConnected: (connected: boolean) => void
  setLights: (lights: LightsState) => void
}

export const TankContext = createContext<TankState & ContextActions>({} as TankState & ContextActions)

export const TankContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setIsConnected] = useState(false)
  const [lights, setLights] = useState<LightsState>({ turnedOn: false })

  const contextActions: ContextActions = {
    setIsConnecting,
    setIsConnected,
    setLights,
  }

  return (
    <TankContext.Provider
      value={{
        isConnecting,
        connected,
        lights,
        ...contextActions,
      }}
    >
      {children}
    </TankContext.Provider>
  )
}
