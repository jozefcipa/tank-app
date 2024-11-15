type OnReceiveHandler = (message: string) => void

class Bluetooth {
  #serviceUUID = 0xffe0
  #serialUUID = 0xffe1
  #btDevice: BluetoothDevice | null = null
  #characteristic: BluetoothRemoteGATTCharacteristic | null = null
  #onReceiveHandler: OnReceiveHandler | null = null
  #receivedDataBuffer = ''

  get isConnected() {
    return Boolean(this.#btDevice?.gatt)
  }

  connect = async () => {
    if (this.isConnected) {
      console.warn('[Bluetooth] Already connected')
      return
    }

    this.#btDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [this.#serviceUUID] }],
    })

    if (!this.#btDevice.gatt) {
      throw new Error('[Bluetooth] gatt is unavailable')
    }

    const server = await this.#btDevice.gatt.connect()
    console.log('[Bluetooth] Connected to GATT server', server)
    const service = await server.getPrimaryService(this.#serviceUUID)
    console.log('[Bluetooth] GATT service retrieved', service)
    this.#characteristic = await service.getCharacteristic(this.#serialUUID)
    console.log('[Bluetooth] GATT characteristic retrieved', this.#characteristic)

    await this.#characteristic.startNotifications()

    // register data listener
    this.#characteristic.addEventListener('characteristicvaluechanged', this.handleData)

    console.log('[Bluetooth] Connection established')
  }

  disconnect = async () => {
    if (this.#btDevice?.gatt) {
      await this.#btDevice.gatt.disconnect()
    }
    this.#btDevice = null
  }

  send = async (data: string, delimiter = '\n') => {
    if (!this.#characteristic) {
      throw new Error('[Bluetooth] Cannot send data: characteristic not available.')
    }

    const message = `${data}${delimiter}`

    try {
      await this.#characteristic.writeValue(new TextEncoder().encode(message))
    } catch (err) {
      // Not sure why this error is thrown, but it doesn't seem to affect the operation
      if ((err as Error).message === 'GATT operation failed for unknown reason.') {
        // do nothing ...
      } else {
        throw err
      }
    }
  }

  onReceive = (handler: (message: string) => void) => {
    this.#onReceiveHandler = handler
  }

  private handleData = (e: Event) => {
    const event = e.target as BluetoothRemoteGATTCharacteristic
    if (!event.value?.buffer) {
      return
    }

    // Incoming message comes in chunks, so we need to concatenate them
    const message = new TextDecoder().decode(new Uint8Array(event.value.buffer))
    this.#receivedDataBuffer += message

    // wait until the whole message is received (ends with \n)
    if (!message.endsWith('\n')) {
      return
    }

    if (!this.#onReceiveHandler) {
      console.warn('[Bluetooth] Incoming data discarded: no listener has been defined.')
      return
    }

    const msg = this.#receivedDataBuffer.trimEnd()
    this.#receivedDataBuffer = ''
    this.#onReceiveHandler(msg)
  }
}

// export class type, not the class itself,
// so it cannot be instantiated outside of this file
export type BluetoothInstance = InstanceType<typeof Bluetooth>

export default new Bluetooth()
