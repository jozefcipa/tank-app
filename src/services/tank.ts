import { BluetoothInstance } from './bluetooth.ts'
import { lights } from '../tank/lights.ts'
import { Periphery, PeripheryActions, PeripheryType, PromisifyFunctions, TankState } from '../tank/types.ts'

type OnDataChangeHandler = (state: Partial<TankState>, err?: Error) => void

// Communication style
// Control App - MASTER
// Tank - SLAVE
// Control App will always send commands to the tank, tank will process the message and send data back
// Tank will never send anything on its own - to keep it simple, we will always ask for data that we want
class Tank {
  #bluetoothInstance: BluetoothInstance | null = null
  // Callback to be called when the state of the tank changes so the UI can be updated
  #onDataChange: OnDataChangeHandler | null = null

  // Dynamically assign periphery actions to the tank
  actions = {
    lights: this.#buildActionWrapper<PeripheryType.Lights, PeripheryActions[PeripheryType.Lights]>(lights),
  }

  init(bluetoothInstance: BluetoothInstance, onDataChange: OnDataChangeHandler) {
    if (!bluetoothInstance.isConnected) {
      throw new Error('[Tank]: Cannot initialize tank. Device is not connected.')
    }
    this.#bluetoothInstance = bluetoothInstance
    this.#onDataChange = onDataChange

    // Register event listener for messages from Arduino
    this.#bluetoothInstance.onReceive(message => {
      try {
        console.log('[Tank] Incoming message from Arduino', message)
        const tankState = this.#parseAnswer(message)

        console.log('[Tank] Parsed tank state', tankState)
        this.#onDataChange!(tankState)
      } catch (err) {
        console.error('[Tank] Error parsing incoming message', err)
        this.#onDataChange!({}, err as Error)
      }
    })
  }

  #buildActionWrapper<Type extends PeripheryType, Actions extends PeripheryActions[Type]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    periphery: Periphery<Type, any, any>,
  ): PromisifyFunctions<Actions> {
    return Object.entries(periphery.actions).reduce((peripheryActions, [actionName, actionFn]) => {
      // TODO: fix TS type
      // @ts-expect-error actionName is a key of PeripheryActions[Type]
      peripheryActions[actionName] = async (...args) => {
        // This is a function wrapper to convert the peripheries' String actions
        // to the actual handlers that send messages to the tank
        // TODO: fix TS type
        // @ts-expect-error `arguments` type is hard to type
        const message = periphery.encodeValue(actionFn(...args))
        await this.#sendMessage(message)
      }
      return peripheryActions
    }, {} as PromisifyFunctions<Actions>)
  }

  async #sendMessage(message: string): Promise<void> {
    if (!this.#bluetoothInstance) {
      throw new Error('[Tank]: Cannot send messages to the tank. Device is not connected.')
    }

    try {
      this.#validateMessageFormat(message)
      console.log('[Tank]: Sending message to tank', message)
      await this.#bluetoothInstance?.send(message)
    } catch (error) {
      console.error('[Tank]: Error sending message to tank', error)

      throw error
    }
  }

  // Message format
  // - key-value pairs are defined in the format "key=value"
  // - individual keys are separated by ;, e.g. "key1=value1;key2=value2"
  // - value structure is arbitrarily defined by the specific periphery
  #validateMessageFormat(message: string) {
    const messageFormat = /[a-zA-Z0-9]+=[a-zA-Z0-9._-]+;*?/
    if (!messageFormat.test(message)) {
      throw new Error(`[Tank]: Corrupted message format: ${message}`)
    }
  }

  #parseAnswer(message: string): Partial<TankState> {
    this.#validateMessageFormat(message)

    const state: Partial<TankState> = {}
    const peripheryValuePairs = message.split(';')

    for (const peripheryValuePair of peripheryValuePairs) {
      const [peripheryType, value] = peripheryValuePair.split('=') as [PeripheryType, string]

      switch (peripheryType) {
        case PeripheryType.Lights: {
          state[peripheryType] = lights.decodeValue(value)
          break
        }
        default: {
          console.warn(`[Tank]: Unknown periphery type ${peripheryType}`)
        }
      }
    }

    return state
  }
}

export const tank = new Tank()
