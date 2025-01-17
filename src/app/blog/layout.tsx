'use client';

import { ScrollToTop } from '@/components/scroll-to-top';
import { Navbar } from '@/components/navbar';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
}
