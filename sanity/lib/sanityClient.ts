import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Basic logging of Sanity configuration
const logSanityConfig = () => {
  console.log('Sanity Configuration:', {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION
  });
};

// Create Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published'
});

// Log configuration on import
logSanityConfig();

// Helper function to fetch data with basic error handling
export async function sanityFetch<T>(
  query: string, 
  params: Record<string, unknown> = {}
): Promise<T> {
  // Validate query
  if (!query || query.trim() === '') {
    throw new Error('Empty Sanity query provided');
  }

  try {
    console.log('Executing Sanity Query:', { 
      query, 
      params,
      projectId: client.config().projectId,
      dataset: client.config().dataset 
    });

    const startTime = Date.now();
    const result = await client.fetch<T>(query, params);
    const duration = Date.now() - startTime;

    console.log('Sanity Query Result:', {
      resultType: typeof result,
      resultLength: Array.isArray(result) ? result.length : 'N/A',
      queryDuration: `${duration}ms`
    });

    return result;
  } catch (error) {
    console.error('Sanity Fetch Error:', error);

    // More informative error messaging
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while fetching from Sanity';

    throw new Error(`Sanity Fetch Failed: ${errorMessage}`);
  }
}

// Image URL builder
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
