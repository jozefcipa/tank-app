import { ObstacleDetector } from './ObstacleDetector.tsx'
import { Toggle } from '../components/Toggle.tsx'
import { useState } from 'react'

type Props = {
    temperature: number
    humidityPercentage: number
    compassPosition: number
    lightsOn: boolean
}

export const Dashboard = (props: Props) =>{
    const [lightsOn, setLightsOn] = useState(props.lightsOn)

    return  (
      <div>
          <ObstacleDetector distance={18}/>
          <div>Temperature: {props.temperature}°C</div>
          <div>Humidity {props.humidityPercentage}%</div>
          <div>Compass: {props.compassPosition}°</div>
          <div>Lights:  <Toggle checked={lightsOn} onChange={(checked) => {
              setLightsOn(checked)
              console.log(`lights set to "${checked}"`)}
          }/>
          </div>
      </div>
    )
}