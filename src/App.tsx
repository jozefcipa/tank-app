import { MotorControlButtons } from './containers/MotorControlButtons.tsx'
import { Camera } from './containers/Camera.tsx'
import { Dashboard } from './containers/Dashboard.tsx'
import { useEffect, useState, useContext } from 'react'
import { MotorDirection } from './tank/types.ts'
import bluetooth from './services/bluetooth.ts'
import { tank } from './services/tank.ts'
import { TankContext } from './tank/context.tsx'

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
  const [leftMotorDirection, setLeftMotorDirection] = useState<MotorDirection | null>(null)
  const [rightMotorDirection, setRightMotorDirection] = useState<MotorDirection | null>(null)

  // useInterval(() => {
  //   console.log('tick')
  //
  //   if (leftMotorDirection || rightMotorDirection) {
  //     console.log('sending to robot', {
  //       leftMotorDirection,
  //       rightMotorDirection,
  //     })
  //   }
  // }, 1000)

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

  useEffect(() => {
    console.log('tank state has changed', tankState)
  }, [tankState])

  return (
    <main className="h-dvh">
      <div className="grid grid-cols-10 h-full">
        <div className="col-span-2 py-5 px-3">
          {/* Left motor */}
          <MotorControlButtons
            onButtonDown={(direction: MotorDirection) => setLeftMotorDirection(direction)}
            onButtonUp={() => setLeftMotorDirection(null)}
          />
        </div>
        <div className="col-span-6 py-5 px-3">
          <div className="grid grid-rows-2 gap-5 h-full">
            <Dashboard
              temperature={20}
              humidityPercentage={50}
              compassPosition={0}
              onLightsToggle={async (enabled: boolean) => {
                try {
                  if (enabled) {
                    await tank.actions.lights.turnOn()
                  } else {
                    await tank.actions.lights.turnOff()
                  }
                  tankState.setLights({ turnedOn: enabled })
                } catch (err) {
                  setError((err as Error).message)
                }
              }}
              onBluetoothConnect={async () => {
                if (tankState.connected || tankState.isConnecting) {
                  return
                }

                // Connect to Bluetooth
                tankState.setIsConnecting(true)
                setError('')
                try {
                  await bluetooth.connect()
                  tank.init(bluetooth, (state, err) => {
                    if (err) {
                      console.error(err)
                      setError(err.message)
                      return
                    }
                    console.log('new state', state)
                  })
                } catch (err: unknown) {
                  const errMessage = (err as Error).message

                  // User cancelled the Bluetooth dialog
                  if (errMessage === 'User cancelled the requestDevice() chooser.') {
                    return
                  }

                  // TODO: wtf is this???
                  if (errMessage === 'GATT operation failed for unknown reason.') {
                    // do nothing ...
                  } else {
                    console.error(err)
                    setError((err as Error).message)
                  }
                } finally {
                  tankState.setIsConnecting(false)
                }

                tankState.setIsConnected(true)
              }}
              error={error}
            />
            <div className="border border-black text-center content-center">
              <Camera />
            </div>
          </div>
        </div>
        <div className="col-span-2 py-5 px-3">
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
