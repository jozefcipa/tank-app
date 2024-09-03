import bluetoothLogo from '../../public/assets/bluetooth.png'
import { cx } from '../utils.ts'

interface Props {
  connected: boolean
  isLoading: boolean
  onClick: () => void
}

export const BluetoothConnect = ({ connected, isLoading, onClick }: Props) =>  (
  <button onClick={onClick} className="flex items-center">
    <img alt="bluetooth" src={bluetoothLogo} className="w-6 mr-2"/>
    <span
      className={cx(
        'font-medium',
        isLoading ? 'text-yellow-500' : connected ? 'text-green-500' : 'text-[#379EF0]',
      )}
    >
      {isLoading ? 'Connecting...' : connected ? 'Connected' : 'Connect to tank'}
    </span>
  </button>
  )