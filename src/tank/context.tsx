import { createContext, ReactNode, useState } from 'react'
import { LightsState, SensorsState, TankState } from './types.ts'

interface ContextActions {
  setIsConnecting: (isConnecting: boolean) => void
  setIsConnected: (connected: boolean) => void
  setLights: (lights: LightsState) => void
  setSensors: (sensors: SensorsState) => void
}

export const TankContext = createContext<TankState & ContextActions>({} as TankState & ContextActions)

export const TankContextProvider = ({ children }: { children: ReactNode }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setIsConnected] = useState(false)
  const [lights, setLights] = useState<LightsState>({ turnedOn: false })
  const [sensors, setSensors] = useState<SensorsState>({
    sonar: -1,
    compass: -1,
    temperature: -1,
    humidity: -1,
  })

  const contextActions: ContextActions = {
    setIsConnecting,
    setIsConnected,
    setLights,
    setSensors,
  }

  return (
    <TankContext.Provider
      value={{
        isConnecting,
        connected,
        lights,
        sensors,
        ...contextActions,
      }}
    >
      {children}
    </TankContext.Provider>
  )
}
