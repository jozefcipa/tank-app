import bluetoothLogo from '/assets/bluetooth.png'
import { cx } from '../utils.ts'

interface Props {
  connected: boolean
  isLoading: boolean
  onClick: () => void
}

export const BluetoothConnect = ({ connected, isLoading, onClick }: Props) =>  (
  <button onClick={onClick} className={cx(
    'flex items-center p-3 border rounded-lg',
    connected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-[#379EF0]')
  }>
    <img alt="bluetooth" src={bluetoothLogo} className="w-6 mr-2"/>
    <span
      className='font-medium text-white'>
      {isLoading ? 'Connecting...' : connected ? 'Connected' : 'Connect to tank'}
    </span>
  </button>
  )