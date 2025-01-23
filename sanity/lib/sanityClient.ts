import { createClient } from "next-sanity"
import { cache } from "react"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'default-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === 'production',
})

export const cachedClient = cache(client.fetch.bind(client))
export const sanityFetch = cachedClient;
