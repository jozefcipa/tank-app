import { ObstacleDetector } from './ObstacleDetector.tsx'
import { Toggle } from '../components/Toggle.tsx'
import { Compass } from '../components/Compass'
import { BluetoothConnect } from '../components/BluetoothConnect.tsx'
import { ErrorAlert } from '../components/ErrorAlert.tsx'

type Props = {
  temperature: number
  humidityPercentage: number
  compassPosition: number
  lightsOn: boolean
  onLightsToggle: (lightsOn: boolean) => void
  onBluetoothConnect: () => Promise<void>
  isBluetoothConnecting: boolean
  isBluetoothConnected: boolean
  error?: string
}

export const Dashboard = (props: Props) => (
  <div className="grid grid-rows-6">
    <div className="row-span-2">
      <ObstacleDetector distance={28}/>
    </div>
    <div className="row-span-2 flex items-center">
      <div className="flex-1 text-left">
        <div className="grid grid-cols-2 gap-1">
          <div>Temperature</div>
          <strong className="text-blue-500">{props.temperature}°C</strong>
          <div>Humidity</div>
          <strong className="text-blue-500">{props.humidityPercentage}%</strong>
          <div>Lights</div>
          <Toggle
            checked={props.lightsOn}
            onChange={() => props.onLightsToggle(!props.lightsOn)}
          />
        </div>
      </div>
      <div className="flex-1">
        <Compass position={props.compassPosition}/>
      </div>
    </div>
    <div className="row-span-1 flex items-center justify-center">
      <BluetoothConnect
        isLoading={props.isBluetoothConnecting}
        connected={props.isBluetoothConnected}
        onClick={props.onBluetoothConnect}
      />
    </div>
    <div className="row-span-1">
      {props.error && <ErrorAlert title={'Error'} message={props.error}/>}
    </div>
  </div>
)