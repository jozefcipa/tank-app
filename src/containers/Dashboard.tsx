import { ObstacleDetector } from './ObstacleDetector.tsx'

export const Dashboard = () => (
  <div>
    <ObstacleDetector distance={28}/>
    <div>Temperature: 22°C</div>
    <div>Humidity 80%</div>
    <div>Compass: 180°</div>
    <div>Lights: <input type="checkbox"/></div>
  </div>
)