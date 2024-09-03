import { ObstacleDetector } from './ObstacleDetector.tsx'
import { Toggle } from '../components/Toggle.tsx'
import { useState } from 'react'
import { Compass } from '../components/Compass'
import { BluetoothConnect } from '../components/BluetoothConnect.tsx'

type Props = {
  temperature: number
  humidityPercentage: number
  compassPosition: number
  lightsOn: boolean
  onBluetoothConnect: () => Promise<void>
}

export const Dashboard = (props: Props) =>{
    const [lightsOn, setLightsOn] = useState(props.lightsOn)
    return  (
      <div>
        <ObstacleDetector distance={18}/>
        <div className="flex items-center">
          <div className="flex-1 text-left">
            <div className="grid grid-cols-2 gap-1">
              <div>Temperature</div>
              <strong className="text-blue-500">{props.temperature}°C</strong>
              <div>Humidity</div>
              <strong className="text-blue-500">{props.humidityPercentage}%</strong>
              <div>Lights</div>
              <Toggle
                checked={lightsOn}
                onChange={(checked) => {
                  setLightsOn(checked)
                  console.log(`lights set to "${checked}"`)
                }
                }/>
              <div className="col-span-2">
                <BluetoothConnect isLoading={false /* todo */} connected={false /* bluetooth.isConnected */} onClick={props.onBluetoothConnect}/>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Compass position={props.compassPosition}/>
          </div>
        </div>
      </div>
    )
}