export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-white px-6 max-w-md mx-auto">{children}</div>
}
