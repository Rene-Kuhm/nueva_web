import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', 
  useCdn: true,
  token: process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

// Helper function to fetch data with error handling
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function getClient() {
  return client;
}

export const toPlainText = (blocks: { 
  _type: string, 
  children?: { text: string }[] 
}[]) => {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
};
