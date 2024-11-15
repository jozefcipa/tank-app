import { MotorControlButtons } from './containers/MotorControlButtons.tsx'
import { Dashboard } from './containers/Dashboard.tsx'
import { useEffect, useState, useContext, useRef } from 'react'
import { MotorDirection } from './tank/types.ts'
import bluetooth from './services/bluetooth.ts'
import { tank } from './services/tank.ts'
import { TankContext } from './tank/context.tsx'
import { useInterval } from './hooks/useInterval.ts'

interface MotorDirections {
  left: MotorDirection
  right: MotorDirection
}

function keyboardEventToMotorDirections(event: KeyboardEvent): MotorDirections | null {
  switch (event.key) {
    case 'ArrowUp':
      return {
        left: MotorDirection.Forward,
        right: MotorDirection.Forward,
      }
    case 'ArrowDown':
      return {
        left: MotorDirection.Backward,
        right: MotorDirection.Backward,
      }
    case 'ArrowLeft':
      return {
        left: MotorDirection.Backward,
        right: MotorDirection.Forward,
      }
    case 'ArrowRight':
      return {
        left: MotorDirection.Forward,
        right: MotorDirection.Backward,
      }
    default:
      return null
  }
}

function App() {
  // TODO: move motors code away from here
  const [leftMotorDirection, setLeftMotorDirection] = useState<MotorDirection | null>(null)
  const [rightMotorDirection, setRightMotorDirection] = useState<MotorDirection | null>(null)
  const sensorsLastRequestedAt = useRef<Date | null>(null)

  useInterval(() => {
    if (!tankState.connected) {
      return
    }

    console.log('tick')

    if (leftMotorDirection || rightMotorDirection) {
      // send motor directions to the tank
      tank.actions.motors
        .turn({
          left: leftMotorDirection || MotorDirection.Stop,
          right: rightMotorDirection || MotorDirection.Stop,
        })
        .catch(err => {
          console.error(err)
          setError((err as Error).message)
        })
    }

    // Get sensors data every second
    if (!sensorsLastRequestedAt.current || Date.now() - sensorsLastRequestedAt.current.getTime() > 3000) {
      // todo decrease
      sensorsLastRequestedAt.current = new Date()
      tank.actions.sensors.read().catch(err => {
        console.error(err)
        setError((err as Error).message)
      })
    }
  }, 1000)

  // TODO: handle disconnect
  // TODO: when connected, and click on connect, disconnect

  const [error, setError] = useState<string>('')

  const tankState = useContext(TankContext)

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

  const handleBluetoothConnect = async () => {
    if (tankState.connected || tankState.isConnecting) {
      return
    }

    // Connect to Bluetooth
    tankState.setIsConnecting(true)
    setError('')

    try {
      // Connect to the tank
      await bluetooth.connect()

      // Initialize the tank wrapper
      tank.init(bluetooth, (newState, err) => {
        if (err) {
          console.error(err)
          setError(err.message)
          return
        }

        if (newState.lights) {
          tankState.setLights(newState.lights)
        }

        if (newState.sensors) {
          tankState.setSensors(newState.sensors)
        }
      })

      // Read the initial sensor data
      await tank.actions.sensors.read()
    } catch (err: unknown) {
      const errMessage = (err as Error).message

      // User cancelled the Bluetooth dialog
      if (errMessage === 'User cancelled the requestDevice() chooser.') {
        return
      }

      console.error(err)
      setError((err as Error).message)
    } finally {
      tankState.setIsConnecting(false)
    }

    tankState.setIsConnected(true)
  }

  const handleLightsToggle = async (enabled: boolean) => {
    try {
      await (enabled ? tank.actions.lights.turnOn() : tank.actions.lights.turnOff())
      tankState.setLights({ turnedOn: enabled })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="h-dvh p-5 overflow-hidden	">
      <div className="grid grid-cols-10 h-full">
        <div className="col-span-2">
          {/* Left motor */}
          <MotorControlButtons
            onButtonDown={(direction: MotorDirection) => setLeftMotorDirection(direction)}
            onButtonUp={() => setLeftMotorDirection(null)}
          />
        </div>
        <div className="col-span-6 px-5">
          <Dashboard onLightsToggle={handleLightsToggle} onBluetoothConnect={handleBluetoothConnect} error={error} />
        </div>
        <div className="col-span-2">
          {/* Right motor */}
          <MotorControlButtons
            onButtonDown={(direction: MotorDirection) => setRightMotorDirection(direction)}
            onButtonUp={() => setRightMotorDirection(null)}
          />
        </div>
      </div>
    </main>
  )
}

export default App
