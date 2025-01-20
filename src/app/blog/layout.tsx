'use client';

import ScrollToTop from '../../components/scroll-to-top'
import Navbar from '../../components/navbar'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ScrollToTop />
    </>
  )
}
