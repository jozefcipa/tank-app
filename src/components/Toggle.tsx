interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Toggle = (props: Props) => (
  <label className="inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={props.checked} onChange={() => props.onChange(!props.checked)} className="sr-only peer"/>
    <div
      className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-lime-500"
    ></div>
  </label>
)