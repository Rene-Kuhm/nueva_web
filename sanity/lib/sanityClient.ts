import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Ensure environment variables are loaded
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Validate Sanity configuration
if (!projectId) {
  console.error('❌ Sanity Project ID is missing');
  throw new Error('Sanity Project ID must be configured in environment variables');
}

// Create Sanity client with explicit configuration
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published'
});

// Comprehensive fetch function with detailed error handling
export async function sanityFetch<T>(
  query: string, 
  params: Record<string, unknown> = {}
): Promise<T> {
  // Validate inputs
  if (!query || query.trim() === '') {
    throw new Error('Empty Sanity query provided');
  }

  try {
    // Log detailed query information for debugging
    console.log('🔍 Sanity Query Details:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      query,
      params
    });

    // Perform the fetch with timing
    const startTime = Date.now();
    const result = await client.fetch<T>(query, params, { 
      // Add additional fetch options if needed
      filterResponse: true 
    });
    const duration = Date.now() - startTime;

    // Log successful fetch details
    console.log('✅ Sanity Fetch Success:', {
      resultType: typeof result,
      resultLength: Array.isArray(result) ? result.length : 'N/A',
      queryDuration: `${duration}ms`
    });

    return result;
  } catch (error) {
    // Detailed error logging
    console.error('❌ Sanity Fetch Error:', {
      errorName: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : 'No error details',
      query,
      params,
      projectConfig: {
        projectId: client.config().projectId,
        dataset: client.config().dataset
      }
    });

    // Specific error handling
    if (error instanceof Error) {
      // Network or connection related errors
      if (error.message.includes('fetch failed') || 
          error.message.includes('network') || 
          error.message.includes('connection')) {
        throw new Error(`Network Error: Unable to connect to Sanity. 
          Check your internet connection, project settings, and CORS configuration.`);
      }

      // Authentication or permission related errors
      if (error.message.includes('Unauthorized') || 
          error.message.includes('permission')) {
        throw new Error(`Authentication Error: Invalid Sanity token or insufficient project permissions.`);
      }

      // Query related errors
      if (error.message.includes('query') || 
          error.message.includes('syntax')) {
        throw new Error(`Query Error: Invalid Sanity query. Check your GROQ syntax.`);
      }
    }

    // Fallback error
    throw new Error(`Sanity Fetch Failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
}

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Client getter with configuration logging
export async function getClient() {
  console.log('📡 Sanity Client Configuration:', {
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    apiVersion: client.config().apiVersion
  });
  return client;
}

// Utility to convert Sanity block content to plain text
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
