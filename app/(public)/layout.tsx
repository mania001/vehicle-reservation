export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-white flex flex-col px-6 max-w-md">{children}</div>
}
