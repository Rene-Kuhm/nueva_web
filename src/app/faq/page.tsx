'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: '¿Qué servicios ofrece KuhmDev?',
    answer: 'Ofrecemos desarrollo de aplicaciones web, consultoría tecnológica, diseño UX/UI, y soluciones de software personalizadas para empresas y emprendedores.'
  },
  {
    question: '¿Cómo comenzamos un proyecto?',
    answer: 'Iniciamos con una reunión de consulta gratuita donde evaluamos tus necesidades, objetivos y presupuesto. Luego, presentamos una propuesta detallada con alcance, tiempo y costos.'
  },
  {
    question: '¿Trabajan con empresas de todos los tamaños?',
    answer: 'Sí, trabajamos con startups, pequeñas y medianas empresas, así como con grandes corporaciones. Adaptamos nuestros servicios a las necesidades específicas de cada cliente.'
  },
  {
    question: '¿Cuáles son sus tecnologías principales?',
    answer: 'Trabajamos principalmente con tecnologías modernas como React, Next.js, TypeScript, Node.js, y utilizamos herramientas de desarrollo como Docker, Kubernetes y servicios en la nube como AWS y Google Cloud.'
  },
  {
    question: '¿Ofrecen soporte post-desarrollo?',
    answer: 'Sí, ofrecemos planes de mantenimiento y soporte técnico para garantizar el funcionamiento óptimo de tu aplicación después de su lanzamiento.'
  },
  {
    question: '¿Cuánto cuesta un proyecto de desarrollo web?',
    answer: 'Los costos varían según la complejidad del proyecto. Realizamos una cotización personalizada después de entender tus requerimientos específicos.'
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        Preguntas Frecuentes
      </h1>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className="border border-border/30 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left 
                         bg-background/50 hover:bg-background/70 transition-colors"
            >
              <span className="font-semibold text-foreground/80">
                {faq.question}
              </span>
              {activeIndex === index ? (
                <ChevronUp className="text-primary" />
              ) : (
                <ChevronDown className="text-foreground/60" />
              )}
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-background/30 text-foreground/70"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          ¿Tienes otra pregunta?
        </h2>
        <p className="text-foreground/80 mb-6">
          Si no encontraste la respuesta que buscabas, no dudes en contactarnos.
        </p>
        <a 
          href="/#contact" 
          className="px-6 py-3 bg-primary text-background rounded-lg 
                     hover:bg-primary/90 transition-colors"
        >
          Contáctanos
        </a>
      </div>
    </div>
  );
}
