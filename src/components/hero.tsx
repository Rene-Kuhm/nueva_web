'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-37 lg:pt-36">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Transformamos Ideas en <span className="text-primary">Experiencias Digitales</span>{' '}
            Excepcionales
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-muted-foreground"
          >
            Somos expertos en desarrollo web y diseño de interfaces. Creamos soluciones digitales
            innovadoras que impulsan el éxito de tu negocio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="#contact">
              <Button size="lg" className="gap-2">
                Contáctanos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Ver Proyectos
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
    </section>
  );
}
