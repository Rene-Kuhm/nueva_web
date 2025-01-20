import React from 'react';
import ScrollToTop from '@/components/scroll-to-top';
import Navbar from '@/components/navbar';
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-layout">
      <Navbar />
      {children}
      <ScrollToTop />
    </div>
  );
}
