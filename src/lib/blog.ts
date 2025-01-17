import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  slug?: string;
}

const blogDirectory = path.join(process.cwd(), 'content/blog');

export function getBlogPosts(): BlogPost[] {
  return [
    {
      title: 'Construyendo APIs Modernas con Next.js',
      excerpt: 'Aprende a crear APIs robustas y escalables utilizando las últimas características de Next.js y TypeScript.',
      content: 'En este artículo exploraremos cómo crear APIs modernas utilizando Next.js y TypeScript. Cubriremos temas como la validación de datos, el manejo de errores, la autenticación y la documentación automática de la API.',
      category: 'Next.js',
      author: 'René Kuhm',
      date: '17 Enero 2024',
      readTime: '5 min',
      image: '/blog/api-nextjs.jpg',
      tags: ['Next.js', 'API', 'TypeScript'],
    },
    {
      title: 'Optimización de Rendimiento en React',
      excerpt: 'Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones React y ofrecer una mejor experiencia de usuario.',
      content: 'Descubre las mejores prácticas para optimizar el rendimiento de tus aplicaciones React. Aprenderás sobre memoización, lazy loading, code splitting y cómo usar las React DevTools para identificar y resolver problemas de rendimiento.',
      category: 'React',
      author: 'René Kuhm',
      date: '15 Enero 2024',
      readTime: '7 min',
      image: '/blog/react-performance.jpg',
      tags: ['React', 'Performance', 'Optimization'],
    },
    {
      title: 'Diseño de Interfaces Modernas',
      excerpt: 'Principios de diseño y mejores prácticas para crear interfaces de usuario atractivas y funcionales.',
      content: 'Explora los principios fundamentales del diseño de interfaces modernas. Desde la teoría del color hasta la tipografía, la jerarquía visual y la accesibilidad, aprenderás todo lo necesario para crear interfaces efectivas.',
      category: 'UI/UX',
      author: 'René Kuhm',
      date: '12 Enero 2024',
      readTime: '6 min',
      image: '/blog/modern-ui.jpg',
      tags: ['UI', 'Design', 'UX'],
    }
  ];
}

export function readMDXPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    return fileNames.map(fileName => {
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        ...(data as Omit<BlogPost, 'content'>),
        content,
        slug: fileName.replace(/\.mdx$/, '')
      };
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getCategories() {
  return [
    { name: 'Desarrollo Web', count: 12 },
    { name: 'React', count: 8 },
    { name: 'TypeScript', count: 6 },
    { name: 'Next.js', count: 5 },
    { name: 'UI/UX', count: 4 },
  ];
}

export function filterPosts(
  posts: BlogPost[], 
  searchTerm: string, 
  selectedCategories: string[]
): BlogPost[] {
  return posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(post.category);
    
    return matchesSearch && matchesCategory;
  });
}
