import { MotorControlButtons } from './containers/MotorControlButtons.tsx'
import { Camera } from './containers/Camera.tsx'
import { Dashboard } from './containers/Dashboard.tsx'
import { useEffect, useState } from 'react'
import { Direction } from './types.ts'
import { useInterval } from './hooks/useInterval.ts'

interface MotorDirections {
  left: Direction
  right: Direction
}

function keyboardEventToMotorDirections(event: KeyboardEvent): MotorDirections | null {
  switch (event.key) {
    case 'ArrowUp':
      return {
        left: Direction.FORWARD,
        right: Direction.FORWARD,
      }
    case 'ArrowDown':
      return {
        left: Direction.BACKWARD,
        right: Direction.BACKWARD,
      }
    case 'ArrowLeft':
      return {
        left: Direction.BACKWARD,
        right: Direction.FORWARD,
      }
    case 'ArrowRight':
      return {
        left: Direction.FORWARD,
        right: Direction.BACKWARD,
      }
    default:
      return null
  }
}

function App() {

  const [leftMotorDirection, setLeftMotorDirection] = useState<Direction | null>(null)
  const [rightMotorDirection, setRightMotorDirection] = useState<Direction | null>(null)

  useInterval(() => {
    console.log('tick')

    if (leftMotorDirection || rightMotorDirection) {
      console.log('sending to robot', {
        leftMotorDirection,
        rightMotorDirection,
      })
    }
  }, 1000)


  useEffect(() => {
    // TODO: init bluetooth here and list devices
  }, [])

  // Handle directions from keyboard
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const motorDirections = keyboardEventToMotorDirections(event)
      if (motorDirections) {
        setLeftMotorDirection(motorDirections.left)
        setRightMotorDirection(motorDirections.right)
      }
    }

    const keyUpHandler = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        console.log('resetting motor directions')
        setLeftMotorDirection(null)
        setRightMotorDirection(null)
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
    }
  }, [])

  return (
    <main className="h-dvh">
      <div className="grid grid-cols-10 h-full">
        <div className="col-span-2 p-3">
          {/* Left motor */}
          <MotorControlButtons
            onButtonDown={(direction: Direction) => setLeftMotorDirection(direction)}
            onButtonUp={() => setLeftMotorDirection(null)}
          />
        </div>
        <div className="col-span-6 p-3">
          <div className="grid grid-rows-5 gap-5 h-full">
            <div className="row-span-2 border border-rose-500 text-center content-center">
              <Dashboard
                temperature={20}
                humidityPercentage={50}
                compassPosition={180}
                lightsOn={true}
              />
            </div>
            <div className="row-span-3 border border-rose-500 text-center content-center">
              <Camera />
            </div>
          </div>
        </div>
        <div className="col-span-2 p-3">
          {/* Right motor */}
          <MotorControlButtons
            onButtonDown={(direction: Direction) => setRightMotorDirection(direction)}
            onButtonUp={() => setRightMotorDirection(null)}
          />
        </div>
      </div>
    </main>
  )
}

export default App
