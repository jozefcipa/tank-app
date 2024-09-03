import { MotorControlButtons } from './containers/MotorControlButtons.tsx'
import { Camera } from './containers/Camera.tsx'
import { Dashboard } from './containers/Dashboard.tsx'
import { useEffect, useState } from 'react'
import { MotorDirection } from './protocol/types.ts'
import bluetooth from './services/bluetooth.ts'
import { ErrorAlert } from './components/ErrorAlert.tsx'

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

  const [bluetoothConnecting, setBluetoothConnecting] = useState(false)
  const [bluetoothConnected, setBluetoothConnected] = useState(false)
  const [error, setError] = useState<string>('')

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
            onButtonDown={(direction: MotorDirection) => setLeftMotorDirection(direction)}
            onButtonUp={() => setLeftMotorDirection(null)}
          />
        </div>
        <div className="col-span-6 p-3">
          <div className="grid grid-rows-5 gap-5 h-full">
            <div className="row-span-2 text-center content-center">
              <Dashboard
                temperature={20}
                humidityPercentage={50}
                compassPosition={180}
                lightsOn={true}
                isBluetoothConnecting={bluetoothConnecting}
                isBluetoothConnected={bluetoothConnected}
                onBluetoothConnect={async () => {
                  if (bluetoothConnected) {
                    return
                  }

                  // Connect to Bluetooth
                  setBluetoothConnecting(true)
                  setError('')
                  try {
                    await bluetooth.connect()
                  } catch (err: unknown) {
                    const errMessage = (err as Error).message

                    // User cancelled the Bluetooth dialog
                    if (errMessage === 'User cancelled the requestDevice() chooser.') {
                      return
                    }

                    setError((err as Error).message)
                  } finally {
                    setBluetoothConnecting(false)
                  }

                  setBluetoothConnected(true)

                  await bluetooth.send('Hello from WEB')
                  bluetooth.onReceive(message => {
                    console.log('[Bluetooth] Incoming message from Arduino', message)
                  })
                }}
              />
              { error && <ErrorAlert title={'Error'} message={error}/> }
            </div>
            <div className="row-span-3 border border-black text-center content-center">
              <Camera/>
            </div>
          </div>
        </div>
        <div className="col-span-2 p-3">
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
