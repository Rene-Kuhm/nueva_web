import { createClient } from "next-sanity"
import { cache } from "react"

// Performance-optimized Sanity configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'default-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: "2023-05-03",
  // Use CDN in production for faster responses
  useCdn: process.env.NODE_ENV === 'production',
  // Optional: Add token for authenticated requests
  token: process.env.SANITY_API_TOKEN,
  // Performance: Reduce unnecessary data transfer
  perspective: 'published',
})

// Check if we're in a server-side environment
const isServerSide = typeof window === 'undefined'

// Advanced caching strategy
export const cachedClient = cache(async (query: string, params = {}) => {
  // Disable cache in draft mode if possible
  const isDraftMode = isServerSide && 
    process.env.NEXT_PUBLIC_DRAFT_MODE === 'true'
  
  if (isDraftMode) {
    return client.fetch(query, params)
  }

  // Cache with configurable revalidation
  return client.fetch(query, params, {
    // Cache control for different query types
    cache: 'force-cache',
    next: {
      revalidate: 60 * 5, // 5 minutes cache
    },
  })
})

// Specialized fetch with performance monitoring
export const sanityFetch = async <T = any>(
  query: string, 
  params = {}, 
  options: { tags?: string[], revalidate?: number } = {}
): Promise<T | null> => {
  const startTime = Date.now()
  try {
    const result = await cachedClient(query, params)
    const duration = Date.now() - startTime
    
    // Optional: Log performance metrics
    console.log(`Sanity Query Performance: ${duration}ms`)
    
    return result as T
  } catch (error) {
    console.error('Sanity Fetch Error:', error)
    return null
  }
}

// Utility for handling errors and providing fallbacks
export const safeSanityFetch = async <T = any>(
  query: string, 
  params = {}, 
  fallbackData?: T
): Promise<T> => {
  try {
    return (await sanityFetch<T>(query, params)) || fallbackData as T
  } catch {
    return fallbackData as T
  }
}
