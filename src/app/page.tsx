'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Smartphone,
  Globe,
  Cpu,
  Mail,
  Rocket,
  CheckCircle2,
  Timer,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContactForm } from '@/components/contact-form';
import { getPosts } from '@/lib/posts';
import Image from 'next/image';
import React from 'react';

const services = [
  {
    icon: Globe,
    title: 'Desarrollo Web',
    description:
      'Creamos sitios web modernos y responsivos que destacan tu marca. Utilizamos las últimas tecnologías como React, Next.js y Node.js.',
    features: [
      'Diseño UI/UX personalizado',
      'SEO optimizado',
      'Rendimiento excepcional',
      'Integración con APIs',
    ],
  },
  {
    icon: Smartphone,
    title: 'Apps Móviles',
    description:
      'Desarrollamos aplicaciones Android nativas y multiplataforma que ofrecen una experiencia de usuario excepcional.',
    features: ['Diseño intuitivo', 'Alto rendimiento', 'Notificaciones push', 'Modo offline'],
  },
  {
    icon: Code,
    title: 'Desarrollo de Software',
    description:
      'Creamos soluciones de software personalizadas que automatizan y optimizan los procesos de tu negocio.',
    features: [
      'Arquitectura escalable',
      'Código limpio y mantenible',
      'Testing automatizado',
      'Documentación completa',
    ],
  },
  {
    icon: Cpu,
    title: 'Sistemas a Medida',
    description:
      'Desarrollamos sistemas empresariales adaptados a tus necesidades específicas para maximizar la eficiencia.',
    features: [
      'Análisis detallado',
      'Soluciones escalables',
      'Integración con sistemas existentes',
      'Soporte continuo',
    ],
  },
];

const stats = [
  { icon: CheckCircle2, value: '100+', label: 'Proyectos Completados' },
  { icon: Users, value: '50+', label: 'Clientes Satisfechos' },
  { icon: Timer, value: '5+', label: 'Años de Experiencia' },
  { icon: Zap, value: '24/7', label: 'Soporte Técnico' },
];

const BackgroundAnimation = () => {
  const generateGeometricShapes = () => {
    return Array.from({ length: 20 }, () => ({
      type: ['triangle', 'circle', 'square'][Math.floor(Math.random() * 3)],
      x: Math.random() * 1500 - 250,
      y: Math.random() * 1000 - 250,
      size: Math.random() * 100 + 50,
      color: [
        'bg-primary/30',
        'bg-blue-500/30',
        'bg-green-500/30',
        'bg-purple-500/30',
        'bg-red-500/30',
      ][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      animationDuration: Math.random() * 10 + 5,
      animationDelay: Math.random() * 3,
    }));
  };

  const [shapes, setShapes] = React.useState([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setShapes(generateGeometricShapes());
    setIsClient(true);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 w-full overflow-hidden">
      {isClient &&
        shapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`absolute ${shape.color} ${
              shape.type === 'triangle'
                ? 'clip-path-triangle'
                : shape.type === 'circle'
                  ? 'rounded-full'
                  : 'rounded-none'
            }`}
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              x: shape.x - 750,
              y: shape.y - 500,
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
              x: [shape.x - 750, shape.x, shape.x + 750],
              y: [shape.y - 500, shape.y, shape.y + 500],
              rotate: [0, shape.rotation, 0],
            }}
            transition={{
              duration: shape.animationDuration,
              delay: shape.animationDelay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Light Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 mix-blend-overlay" />
    </div>
  );
};

export default function Home() {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <main className="relative">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 50,
            damping: 10,
            duration: 1,
          }}
          className="relative min-h-[100vh] overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <BackgroundAnimation />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 15,
              delay: 0.2,
            }}
            className="container relative mx-auto px-4"
          >
            <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-12 py-20 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: 0.3,
                }}
                className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              >
                Transformamos Ideas en{' '}
                <motion.span
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 15,
                    delay: 0.4,
                  }}
                  className="text-primary"
                >
                  Experiencias Digitales
                </motion.span>{' '}
                Excepcionales
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 15,
                  delay: 0.4,
                }}
                className="max-w-2xl text-lg text-muted-foreground sm:text-xl"
              >
                Somos expertos en desarrollo web y diseño de interfaces. Creamos soluciones
                digitales innovadoras que impulsan el éxito de tu negocio.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 90,
                  damping: 15,
                  delay: 0.5,
                }}
                className="flex justify-center"
              >
                <Link href="#contact">
                  <Button size="lg" className="gap-2 text-lg">
                    Contáctanos
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 80, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: 0.6,
                }}
                className="flex justify-center space-x-4"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="h-2 w-2 rounded-full bg-primary" />
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Services Section */}
        <section id="services" className="relative bg-muted/50 py-20 dark:bg-muted/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 flex items-center justify-center space-x-2">
                <Rocket className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestros Servicios
                </span>
              </div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Soluciones Digitales Completas
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
                Transformamos ideas en realidad digital con tecnologías de vanguardia y un enfoque
                centrado en resultados
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="relative z-10">
                    <service.icon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                    <p className="mb-4 text-muted-foreground">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Sobre Nosotros
                  </span>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                  Expertos en Desarrollo Digital
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Somos un equipo apasionado por la tecnología y la innovación. Nos especializamos
                  en crear soluciones digitales que transforman negocios y mejoran la vida de las
                  personas.
                </p>

                <div className="mb-8 grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-lg bg-card p-4 text-center shadow-lg"
                    >
                      <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Tecnología de Punta',
                      description: 'Utilizamos las últimas tecnologías y mejores prácticas.',
                    },
                    {
                      title: 'Enfoque Personalizado',
                      description: 'Cada proyecto es único y recibe atención personalizada.',
                    },
                    {
                      title: 'Resultados Garantizados',
                      description: 'Nos comprometemos con el éxito de tu proyecto.',
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <Shield className="h-6 w-6 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-card/80 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  <div className="h-full bg-muted" />
                  <div className="absolute inset-0 flex h-full flex-col justify-between p-8 font-mono text-base leading-relaxed">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-primary"
                    >
                      <span className="text-blue-500">import</span> {'{'} NextJS, React, TypeScript{' '}
                      {'}'} <span className="text-blue-500">from</span>{' '}
                      <span className="text-orange-500">&quot;@modern-stack&quot;</span>;
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <span className="text-blue-500">class</span>{' '}
                      <span className="text-green-500">DigitalSolution</span>{' '}
                      <span className="text-blue-500">implements</span>{' '}
                      <span className="text-purple-500">IInnovation</span> {'{'}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="ml-6 space-y-4"
                    >
                      <div>
                        <span className="text-blue-500">private</span>{' '}
                        <span className="text-yellow-500">readonly</span> technologies = [
                        <br />
                        <span className="ml-8 text-orange-500">&quot;Next.js ⚡️&quot;</span>,
                        <br />
                        <span className="ml-8 text-orange-500">&quot;React 🚀&quot;</span>,
                        <br />
                        <span className="ml-8 text-orange-500">&quot;TypeScript 🛡️&quot;</span>
                        <br />
                        ];
                      </div>

                      <div>
                        <span className="text-purple-500">async</span> createProject(
                        <span className="text-blue-500">idea</span>: string ):
                        Promise&lt;Success&gt; {'{'}
                        <br />
                        <span className="ml-8">
                          <span className="text-blue-500">const</span> innovation ={' '}
                          <span className="text-yellow-500">await</span>{' '}
                          <span className="text-purple-500">this</span>.transform(idea);
                        </span>
                        <br />
                        <br />
                        <span className="ml-8">
                          <span className="text-blue-500">const</span> result = {'{'}
                        </span>
                        <br />
                        <span className="ml-12">
                          quality: <span className="text-orange-500">&quot;exceptional&quot;</span>,
                        </span>
                        <br />
                        <span className="ml-12">
                          performance:{' '}
                          <span className="text-orange-500">&quot;blazing-fast&quot;</span>,
                        </span>
                        <br />
                        <span className="ml-12">
                          satisfaction:{' '}
                          <span className="text-orange-500">&quot;guaranteed&quot;</span>
                        </span>
                        <br />
                        <span className="ml-8">{'}'}</span>
                        <br />
                        <br />
                        <span className="ml-8">
                          <span className="text-yellow-500">return</span>{' '}
                          <span className="text-blue-500">new</span> Success(result);
                        </span>
                        <br />
                        {'}'}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      {'}'}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                      className="absolute bottom-4 right-4 h-4 w-4 rounded-full bg-primary"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-lg bg-primary/20 backdrop-blur-xl" />
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-lg bg-primary/20 backdrop-blur-xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-center text-3xl font-bold">Nuestro Blog</h2>
              <p className="mx-auto max-w-2xl text-center text-muted-foreground">
                Explora nuestros artículos más recientes sobre desarrollo web, tecnología y mejores
                prácticas
              </p>
            </motion.div>

            <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-lg"
                >
                  {post.image?.asset?.url && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.image.asset.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                    <div className="mb-4 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug.current}`}>
                    <Button variant="outline" className="w-full">
                      Leer más
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-center text-3xl font-bold">Contáctanos</h2>
              <p className="mx-auto max-w-2xl text-center text-muted-foreground">
                ¿Tienes un proyecto en mente? ¡Nos encantaría escucharte! Completa el formulario y
                te contactaremos lo antes posible.
              </p>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Información de Contacto</h3>
                  <p className="text-muted-foreground">
                    Estamos aquí para ayudarte. No dudes en contactarnos para cualquier consulta.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">info@tuempresa.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Teléfono</h4>
                      <p className="text-sm text-muted-foreground">+1234567890</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Ubicación</h4>
                      <p className="text-sm text-muted-foreground">Ciudad, País</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">Síguenos en Redes Sociales</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="rounded-lg bg-primary/10 p-2 transition-colors hover:bg-primary/20"
                    >
                      <Twitter className="h-5 w-5 text-primary" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a
                      href="#"
                      className="rounded-lg bg-primary/10 p-2 transition-colors hover:bg-primary/20"
                    >
                      <Linkedin className="h-5 w-5 text-primary" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                    <a
                      href="#"
                      className="rounded-lg bg-primary/10 p-2 transition-colors hover:bg-primary/20"
                    >
                      <Github className="h-5 w-5 text-primary" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Decorative elements */}
                <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

                {/* Contact form */}
                <div className="relative">
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
