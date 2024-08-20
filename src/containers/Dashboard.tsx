import { ObstacleDetector } from './ObstacleDetector.tsx'

type Props = {
    temperature: number
    humidityPercentage: number
    compassPosition: number
    lightsOn: boolean
}

export const Dashboard = (props: Props) => (
  <div>
    <ObstacleDetector distance={28}/>
    <div>Temperature: {props.temperature}°C</div>
    <div>Humidity {props.humidityPercentage}%</div>
    <div>Compass: {props.compassPosition}°</div>
    <div>Lights: <input type="checkbox" checked={props.lightsOn}/></div>
  </div>
)