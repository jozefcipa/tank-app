import './styles.css'

interface Props {
  position: number
}

export const Compass = ({ position }: Props) => {
  return (
    <div>
      <div className="compass">
        <div className="compass-inner">
          <div className="north">N</div>
          <div className="east">E</div>
          <div className="west">W</div>
          <div className="south">S</div>
          <div className="main-arrow" style={{transform: `rotate(${position}deg)`}}>
            <div className="arrow-up"></div>
            <div className="arrow-down"></div>
          </div>
        </div>
      </div>
      <span>{position}°</span>
    </div>
  )
}