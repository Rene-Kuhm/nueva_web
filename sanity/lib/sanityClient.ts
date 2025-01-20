import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Comprehensive environment variable logging
const logEnvConfig = () => {
  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_TOKEN: process.env.SANITY_TOKEN ? '***' : 'Not set',
    SANITY_READ_TOKEN: process.env.SANITY_READ_TOKEN ? '***' : 'Not set',
    NODE_ENV: process.env.NODE_ENV
  };

  console.log('Sanity Environment Configuration:', JSON.stringify(envVars, null, 2));
  return envVars;
};

// Get the most appropriate project ID
const getProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
                    process.env.SANITY_PROJECT_ID;
  
  if (!projectId) {
    console.error('No Sanity Project ID found in environment variables');
    throw new Error('Sanity Project ID is not configured');
  }
  
  return projectId;
};

// Get the most appropriate dataset
const getDataset = () => {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 
                  process.env.SANITY_DATASET || 
                  'production';
  
  console.log('Using Sanity Dataset:', dataset);
  return dataset;
};

// Log environment configuration on import
logEnvConfig();

export const client = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  apiVersion: '2024-01-01', 
  useCdn: true,
  token: process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

// Helper function to fetch data with comprehensive error handling
export async function sanityFetch<T>(
  query: string, 
  params: Record<string, unknown> = {}
): Promise<T> {
  // Additional query validation
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
    // Detailed error logging
    console.error('Detailed Sanity Fetch Error:', {
      errorType: error instanceof Error ? error.name : 'Unknown Error',
      errorMessage: error instanceof Error ? error.message : 'No error details',
      query: query,
      params: params,
      projectConfig: {
        projectId: client.config().projectId,
        dataset: client.config().dataset
      }
    });

    // More informative and specific error throwing
    if (error instanceof Error) {
      if (error.message.includes('Request error')) {
        throw new Error(`Network Error: Unable to connect to Sanity. Check your internet connection and Sanity project settings.`);
      }
      if (error.message.includes('Unauthorized')) {
        throw new Error(`Authentication Error: Invalid Sanity token or insufficient permissions.`);
      }
    }

    throw new Error(`Sanity Fetch Failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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
