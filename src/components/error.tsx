interface ErrorProps {
  message: string
}

export default function Error({ message }: ErrorProps) {
  return (
    <span className='text-sm text-red-400'>
      {message}
    </span>
  )
}
