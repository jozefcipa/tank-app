export enum PeripheryType {
  Lights = 'lights',
  Sensors = 'sensors',
  Motors = 'motors',
}

export interface PeripheryActions {
  [PeripheryType.Lights]: {
    turnOn: () => string
    turnOff: () => string
  }
  [PeripheryType.Sensors]: {
    read: () => string
  }
  [PeripheryType.Motors]: {
    turn: (directions: { right: MotorDirection; left: MotorDirection }) => string
  }
}

// Utility type to promisify function return types
// This mapped type iterates over the keys of a given type T.
// For each key K, it checks if the property T[K] is a function.
// T[K] extends (...args: infer Args) => infer R uses conditional types to check if T[K] is a function and extracts its argument types Args and return type R.
// If it's a function, it creates a new function type with the same arguments but wraps the return type in a Promise<R>.
// If it's not a function, it leaves the property as is.
export type PromisifyFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => unknown ? (...args: Args) => Promise<void> : T[K]
}

export interface Periphery<T extends PeripheryType, State = unknown> {
  type: T
  decodeValue: (value: string) => State
  actions: PeripheryActions[T]
}

// These values are recognized by the Tank app,
// don't change them unless you update the Arduino code too
export enum MotorDirection {
  Forward = 'F',
  Backward = 'B',
  Stop = '0',
}

export interface LightsState {
  turnedOn: boolean
}

export interface SensorsState {
  sonar: number
  compass: number
  temperature: number
  humidity: number
}

export interface TankState {
  isConnecting: boolean
  connected: boolean
  [PeripheryType.Lights]: LightsState
  [PeripheryType.Sensors]: SensorsState
}
