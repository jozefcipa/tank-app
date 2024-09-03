interface Props {
  title: string
  message: string
}

export const ErrorAlert = ({ title, message }: Props) => (
  <div className="border border-rose-500 bg-rose-200 rounded-md border-2 flex flex-col py-1 px-2 items-start">
    <strong className="text-rose-700">{title}</strong>
    <p className="text-rose-600">{message}</p>
  </div>
)