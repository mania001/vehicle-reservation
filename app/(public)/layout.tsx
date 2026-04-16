export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-white px-6 w-full md:max-w-md md:mx-auto">{children}</div>
}
