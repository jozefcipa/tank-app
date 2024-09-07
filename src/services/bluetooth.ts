type OnReceiveHandler = (message: string) => void

class Bluetooth {
  // TODO find out what these numbers mean
  #serviceUUID = 0xffe0
  #serialUUID = 0xffe1
  #btDevice: BluetoothDevice | null = null
  #characteristic: BluetoothRemoteGATTCharacteristic | null = null
  #onReceiveHandler: OnReceiveHandler | null = null

  get isConnected() {
    return Boolean(this.#btDevice?.gatt)
  }

  connect = async () => {
    if (this.isConnected) {
      console.warn('Bluetooth is already connected')
    }

    this.#btDevice = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [this.#serviceUUID],
        },
      ],
    })

    if (!this.#btDevice.gatt) {
      throw new Error('[Bluetooth] gatt is unavailable')
    }

    // todo what is GATT, service and characteristic?

    const server = await this.#btDevice.gatt.connect()
    const service = await server.getPrimaryService(this.#serviceUUID)
    this.#characteristic = await service.getCharacteristic(this.#serialUUID)

    // todo what this does
    await this.#characteristic.startNotifications()

    // register data listener
    this.#characteristic.addEventListener('characteristicvaluechanged', this.handleData)
  }

  disconnect = async () => {
    if (this.#btDevice?.gatt) {
      await this.#btDevice.gatt.disconnect()
    }
  }

  send = async (data: string, delimiter = '\n') => {
    if (!this.#characteristic) {
      throw new Error('[Bluetooth] Cannot send data: characteristic not available.')
    }

    const message = `${data}${delimiter}`
    const buffer = new ArrayBuffer(message.length)
    const encodedMessage = new Uint8Array(buffer)

    for (let i = 0; i < message.length; i++) {
      encodedMessage[i] = message.charCodeAt(i)
    }

    await this.#characteristic.writeValue(encodedMessage)
  }

  onReceive = (handler: (message: string) => void) => {
    this.#onReceiveHandler = handler
  }

  private handleData = (event: any /* TODO: figure out correct types */) => {
    const rawData = new Uint8Array(event.target?.value.buffer)
    const message = String.fromCharCode.apply(null, rawData as any)

    if (!this.#onReceiveHandler) {
      console.warn('[Bluetooth] Incoming data discarded: no listener has been defined.')
      return
    }

    this.#onReceiveHandler(message)
  }
}

// export class type, not the class itself,
// so it cannot be instantiated outside of this file
export type BluetoothInstance = InstanceType<typeof Bluetooth>

export default new Bluetooth()
