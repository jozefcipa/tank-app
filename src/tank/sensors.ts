import { Periphery, PeripheryType, SensorsState } from './types'

enum SensorsAction {
  READ = 'READ',
}

enum SensorPeriphery {
  SONAR = 'sonar',
  COMPASS = 'compass',
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
}

export const sensors: Periphery<PeripheryType.Sensors, SensorsState> = {
  type: PeripheryType.Sensors,
  actions: {
    read: () => SensorsAction.READ,
  },

  // Format is:
  // sonar:25|compass:189|temperature:25.8|humidity:58
  decodeValue: (value: string): SensorsState => {
    const messageFormat = /^[a-zA-Z]+:[\s0-9.-]+$/

    value.split('|').forEach(sensorValuePair => {
      if (!messageFormat.test(sensorValuePair)) {
        throw new Error(`[Sensors]: Corrupted value format: ${sensorValuePair}`)
      }
    })

    const peripheries = value.split('|').reduce(
      (parsedPeripheries, periphery) => {
        const [key, value] = periphery.split(':')
        parsedPeripheries[key as SensorPeriphery] = Number(value)
        return parsedPeripheries
      },
      {} as Record<SensorPeriphery, number>,
    )

    return {
      sonar: peripheries[SensorPeriphery.SONAR] ?? -1,
      compass: peripheries[SensorPeriphery.COMPASS] ?? -1,
      temperature: peripheries[SensorPeriphery.TEMPERATURE] ?? -1,
      humidity: peripheries[SensorPeriphery.HUMIDITY] ?? -1,
    }
  },
}
