import { cx } from "../utils"

enum ProximityLevel {
  Critical = 'critical',
  Warning = 'warning',
  Caution = 'caution',
  Safe = 'safe',
}

const colors = {
  [ProximityLevel.Critical]: '#c52c00',
  [ProximityLevel.Warning]: '#f7502a',
  [ProximityLevel.Caution]: '#fbc531',
  [ProximityLevel.Safe]: '#44bd32',
}

const style = (color: string) => ({
  borderBottom: `20px solid ${color}`,
  borderLeft: '20px solid transparent',
  borderRight: '20px solid transparent'
})

const proximityLevelOpacity = (value: ProximityLevel, proximityLevel: ProximityLevel) =>
  value === proximityLevel ? 'opacity-100' : 'opacity-20'

const evaluateProximityLevel = (distance: number) => {
  switch (true) {
    case distance < 5:
      return ProximityLevel.Critical
    case distance < 10:
      return ProximityLevel.Warning
    case distance < 25:
      return ProximityLevel.Caution
    default:
      return ProximityLevel.Safe
  }
}

export const ObstacleDetector = (props: { distance: number }) => {
  const proximityLevel = evaluateProximityLevel(props.distance)

  return (
    <div className="flex flex-col items-center border-t-2 border-black">
      <div
        className={cx('h-0 w-[21rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Critical))}
        style={style(colors[ProximityLevel.Critical])}
      ></div>
      <div
        className={cx('h-0 w-[24rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Warning))}
        style={style(colors[ProximityLevel.Warning])}
      ></div>
      <div
        className={cx('h-0 w-[27rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Caution))}
        style={style(colors[ProximityLevel.Caution])}
      ></div>
      <div
        className={cx('h-0 w-[30rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Safe))}
        style={style(colors[ProximityLevel.Safe])}
      ></div>
      <div className="text-lg" style={{ color: colors[proximityLevel]}}>
        {props.distance < 100 ? props.distance : '> 100'} cm
      </div>
    </div>
  )
}
