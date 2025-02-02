import { createClient } from 'next-sanity';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  apiVersion: '2023-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

const sanityClient = createClient(config);

export async function testSanityConnection() {
  try {
    // Intenta obtener algunos documentos de prueba
    const query = `*[_type == "post"][0...5] {
      title,
      slug,
      publishedAt
    }`;
    
    const posts = await sanityClient.fetch(query);
    
    console.log('Conexión a Sanity exitosa. Posts encontrados:', posts.length);
    return posts;
  } catch (error) {
    console.error('Error al conectar con Sanity:', error);
    throw error;
  }
}

// Ejecutar la prueba si se importa directamente
if (require.main === module) {
  testSanityConnection();
}
