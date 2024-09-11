import { ObstacleDetector } from './ObstacleDetector.tsx'
import { Toggle } from '../components/Toggle.tsx'
import { Compass } from '../components/Compass'
import { BluetoothConnect } from '../components/BluetoothConnect.tsx'
import { ErrorAlert } from '../components/ErrorAlert.tsx'
import { useContext } from 'react'
import { TankContext } from '../tank/context.tsx'

type Props = {
  onLightsToggle: (lightsOn: boolean) => void
  onBluetoothConnect: () => Promise<void>
  error?: string
}

const formatValue = (value: number) => (value === -1 ? '-' : value.toFixed(1))

export const Dashboard = (props: Props) => {
  const tankState = useContext(TankContext)

  return (
    <div className="grid grid-rows-6">
      <div className="row-span-2">
        <ObstacleDetector />
      </div>
      <div className="row-span-2 flex items-center">
        <div className="flex-1 text-left">
          <div className="grid grid-cols-2 gap-1">
            <div>Temperature</div>
            <strong className="text-blue-500">{formatValue(tankState.sensors.temperature)}°C</strong>
            <div>Humidity</div>
            <strong className="text-blue-500">{formatValue(tankState.sensors.humidity)} %</strong>
            <div>Lights</div>
            <Toggle
              checked={tankState.lights.turnedOn}
              onChange={() => props.onLightsToggle(!tankState.lights.turnedOn)}
              disabled={!tankState.connected}
            />
          </div>
        </div>
        <div className="flex-1">
          <Compass position={tankState.sensors.compass} />
        </div>
      </div>
      <div className="row-span-1 flex items-center justify-center">
        <BluetoothConnect
          isLoading={tankState.isConnecting}
          connected={tankState.connected}
          onClick={props.onBluetoothConnect}
        />
      </div>
      {/* TODO fix layout moving when error is displayed (row height changes for all rows)*/}
      <div className="row-span-1">{props.error && <ErrorAlert title={'Error'} message={props.error} />}</div>
    </div>
  )
}
