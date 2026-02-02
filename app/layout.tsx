import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-background text-foreground">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
