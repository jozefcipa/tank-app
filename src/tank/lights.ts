import { LightsState, Periphery, PeripheryType } from './types'

enum LightStatus {
  ON = 'ON',
  OFF = 'OFF',
}

export const lights: Periphery<PeripheryType.Lights, LightsState> = {
  type: PeripheryType.Lights,
  actions: {
    turnOn: () => LightStatus.ON,
    turnOff: () => LightStatus.OFF,
  },
  decodeValue: (value: string): LightsState => ({
    turnedOn: value === LightStatus.ON,
  }),
}
