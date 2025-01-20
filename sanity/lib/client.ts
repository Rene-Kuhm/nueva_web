import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true, // Enable CDN for better performance
  perspective: 'published',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // Optional: for authenticated requests
  ignoreBrowserTokenWarning: true // Important for client-side requests
})
