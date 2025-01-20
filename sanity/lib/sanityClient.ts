import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Comprehensive environment and network diagnostics
const performNetworkDiagnostics = async () => {
  console.log('Starting Sanity Network Diagnostics');

  // Log environment variables
  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_DATASET: process.env.SANITY_DATASET,
    NODE_ENV: process.env.NODE_ENV
  };
  console.log('Environment Variables:', JSON.stringify(envVars, null, 2));

  // Check basic network connectivity
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('Internet Connectivity: Successful');
  } catch (error) {
    console.error('Internet Connectivity Test Failed:', error);
    throw new Error('No internet connection detected');
  }

  // Validate Sanity project configuration
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';

  if (!projectId) {
    console.error('Sanity Project ID is missing');
    throw new Error('Sanity Project ID is not configured');
  }

  console.log('Sanity Project Diagnostics:', {
    projectId,
    dataset
  });

  return { projectId, dataset };
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

// Perform diagnostics on import
performNetworkDiagnostics().catch(console.error);

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
    // Perform network diagnostics before each fetch
    await performNetworkDiagnostics();

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
      if (error.message.includes('fetch failed') || error.message.includes('No internet connection')) {
        throw new Error(`Network Error: Unable to connect to Sanity. Verify internet connection and project settings.`);
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
