import { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Nueva Web',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Mi nueva web con Next.js',
};
