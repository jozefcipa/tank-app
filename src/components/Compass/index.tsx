import './styles.css'

interface Props {
  position: number
}

export const Compass = ({ position }: Props) => {
  return (
    <div className="text-center">
      <div className="compass">
        <div className="compass-inner">
          <div className="north">N</div>
          <div className="east">E</div>
          <div className="west">W</div>
          <div className="south">S</div>
          <div className="main-arrow" style={{ transform: `rotate(${position === -1 ? 0 : position}deg)` }}>
            <div className="arrow-up"></div>
            <div className="arrow-down"></div>
          </div>
        </div>
      </div>
      <span>{position === -1 ? '-' : position}°</span>
    </div>
  )
}
