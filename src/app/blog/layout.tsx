import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Your Professional Insights',
  description: 'Discover expert insights, tutorials, and industry trends',
  openGraph: {
    title: 'Professional Blog',
    description: 'Expert insights and knowledge sharing',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </div>
    </div>
  );
}
