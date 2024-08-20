import { useEffect, useRef } from 'react'

type Callback = () => void

// Courtesy of Dan Abramov
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: Callback, delay: number) {
  const savedCallback = useRef<Callback>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current!()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
