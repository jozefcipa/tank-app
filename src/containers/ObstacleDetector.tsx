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
  borderBottom: `15px solid ${color}`,
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent'
})

const proximityLevelOpacity = (value: ProximityLevel, proximityLevel: ProximityLevel) =>
  value === proximityLevel ? 'opacity-100' : 'opacity-40'

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

  const color = `text-[${colors[proximityLevel]}]` // TODO: color doesn't get updated, but #bada55 works
  // const color = `text-[#bada55]`
  return (
    <div className="flex flex-col items-center">
      <div
        className={cx('h-0 w-[5.5rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Critical))}
        style={style(colors[ProximityLevel.Critical])}
      ></div>
      <div
        className={cx('h-0 w-[7rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Warning))}
        style={style(colors[ProximityLevel.Warning])}
      ></div>
      <div
        className={cx('h-0 w-[8.5rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Caution))}
        style={style(colors[ProximityLevel.Caution])}
      ></div>
      <div
        className={cx('h-0 w-[10rem] mb-1', proximityLevelOpacity(proximityLevel, ProximityLevel.Safe))}
        style={style(colors[ProximityLevel.Safe])}
      ></div>
      <div className={cx('font-bold', color)}>
        { proximityLevel !== ProximityLevel.Safe && <>{props.distance}&nbsp;cm </> }
      </div>
    </div>
  )
}
