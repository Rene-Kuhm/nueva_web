'use client'

import { Hero } from '@/components/hero'
import { SmoothScroll } from '@/components/smooth-scroll'
import { motion } from 'framer-motion'
import { Code, Smartphone, Globe, Cpu, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Globe,
    title: 'Desarrollo Web',
    description: 'Sitios web modernos y responsivos con las últimas tecnologías.',
  },
  {
    icon: Smartphone,
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas y multiplataforma para Android.',
  },
  {
    icon: Code,
    title: 'Desarrollo de Software',
    description: 'Soluciones de software personalizadas para tu negocio.',
  },
  {
    icon: Cpu,
    title: 'Sistemas a Medida',
    description: 'Sistemas adaptados a tus necesidades específicas.',
  },
]

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="relative">
        {/* Hero Section */}
        <section id="home" className="min-h-screen">
          <Hero />
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="relative bg-muted/50 py-20 dark:bg-muted/10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Nuestros Servicios
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
                Ofrecemos soluciones digitales completas para ayudarte a crecer en el mundo digital
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
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-12 md:grid-cols-2"
            >
              <div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  Sobre Nosotros
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Somos un equipo apasionado por la tecnología y el desarrollo de software.
                  Nos especializamos en crear soluciones digitales que ayudan a nuestros
                  clientes a alcanzar sus objetivos.
                </p>
                <ul className="space-y-4">
                  {[
                    'Más de 5 años de experiencia',
                    'Proyectos entregados con éxito',
                    'Tecnologías de última generación',
                    'Soporte continuo',
                  ].map((item) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  {/* Aquí puedes agregar una imagen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="bg-muted/50 py-20 dark:bg-muted/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Últimas Publicaciones
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
                Mantente actualizado con las últimas tendencias en desarrollo
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((_, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group overflow-hidden rounded-lg bg-card shadow-lg"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold">
                      Título del Artículo {index + 1}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore.
                    </p>
                    <Button variant="link" className="p-0">
                      Leer más →
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Contacto
              </h2>
              <p className="mb-8 text-muted-foreground">
                ¿Tienes un proyecto en mente? ¡Hablemos!
              </p>
              <Button size="lg" className="w-full md:w-auto">
                Enviar Mensaje
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
