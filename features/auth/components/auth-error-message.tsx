type Props = {
  message?: string
}

export function AuthErrorMessage({ message }: Props) {
  if (!message) return null

  return <p className="text-sm text-red-500">{message}</p>
}
