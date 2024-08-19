import { MotorControlButtons } from './containers/MotorControlButtons.tsx'
import { Camera } from './containers/Camera.tsx'
import { Dashboard } from './containers/Dashboard.tsx'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    // TODO register keypress event listeners

    // TODO: init bluetooth here and list devices

  }, [])

  return (
    <main className="h-dvh">
      <div className="grid grid-cols-10 h-full">
        <div className="col-span-2 p-3">
          {/* Left motor */}
          <MotorControlButtons/>
        </div>
        <div className="col-span-6 p-3">
          <div className="grid grid-rows-5 gap-5 h-full">
            <div className="row-span-2 bg-blue-200 text-center content-center">
              <Dashboard />
            </div>
            <div className="row-span-3 bg-orange-200 text-center content-center">
              <Camera />
            </div>
          </div>
        </div>
        <div className="col-span-2 p-3">
          {/* Right motor */}
          <MotorControlButtons/>
        </div>
      </div>
    </main>
  )
}

export default App
