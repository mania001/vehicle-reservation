import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { HideAddressBar } from '@/components/common/hide-address-bar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-background text-foreground">
        <HideAddressBar />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
