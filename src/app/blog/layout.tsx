import { type ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/navbar'
import {Footer} from '@/components/footer'
import ScrollToTop from '@/components/scroll-to-top'

export default function BlogLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}
