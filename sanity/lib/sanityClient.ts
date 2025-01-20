import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Detailed logging for environment variables
console.log('Sanity Config:', {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN ? '***' : 'No token'
});

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', 
  useCdn: true,
  token: process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

// Helper function to fetch data with comprehensive error handling
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  try {
    console.log('Executing Sanity Query:', query);
    
    const result = await client.fetch<T>(query, params);
    
    console.log('Sanity Query Result:', {
      resultType: typeof result,
      resultLength: Array.isArray(result) ? result.length : 'N/A'
    });
    
    return result;
  } catch (error) {
    console.error('Detailed Sanity Fetch Error:', {
      errorName: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : 'No error details',
      query: query,
      params: params
    });

    // More informative error throwing
    throw new Error(`Sanity Fetch Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
