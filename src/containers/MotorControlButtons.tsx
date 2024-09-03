import { Direction } from '../types.ts'

type Props = {
  onButtonDown: (direction: Direction) => void
  onButtonUp: () => void
}

type ButtonProps = Props & { direction: Direction }

const Button = (props: ButtonProps) => (
  <button
    className="border text-center content-center text-5xl text-slate-800 bg-[#e3e4e7] border rounded-xl hover:bg-[#dcdde1] focus:hover:bg-[#dcdde1] duration-100"
    onTouchStart={() => props.onButtonDown(props.direction)}
    onTouchEnd={props.onButtonUp}
  >
    { props.direction === Direction.FORWARD ? '▲' : '▼' }
  </button>
)

export const MotorControlButtons = (props: Props) => (
  <div className="grid grid-rows-2 gap-5 h-full">
    <Button
      direction={Direction.FORWARD}
      onButtonDown={props.onButtonDown}
      onButtonUp={props.onButtonUp}
    />
    <Button
      direction={Direction.BACKWARD}
      onButtonDown={props.onButtonDown}
      onButtonUp={props.onButtonUp}
    />
  </div>
)