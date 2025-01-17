'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon, GithubIcon, TwitterIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
          Bienvenido a Nueva Web
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Una plantilla moderna de Next.js con UI de última generación, 
          componentes accesibles y un diseño elegante.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="group"
            onClick={() => window.location.href = '/getting-started'}
          >
            Comenzar
            <ArrowRightIcon 
              className="ml-2 group-hover:translate-x-1 transition-transform" 
            />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <GithubIcon className="mr-2" />
            GitHub
          </Button>
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.4, 
            type: 'spring', 
            stiffness: 100 
          }}
          className="bg-secondary/10 rounded-xl p-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-semibold mb-4 text-secondary-foreground">
            Características
          </h2>
          
          <ul className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Next.js 15', desc: 'Última versión con App Router' },
              { title: 'UI Moderna', desc: 'Componentes accesibles y personalizables' },
              { title: 'Tailwind CSS', desc: 'Diseño rápido y responsive' }
            ].map((feature, index) => (
              <motion.li 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-background p-4 rounded-lg border"
              >
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <div className="mt-12 flex justify-center space-x-4 text-muted-foreground">
          <TwitterIcon 
            className="hover:text-primary cursor-pointer" 
            onClick={() => window.open('https://twitter.com', '_blank')}
          />
          <GithubIcon 
            className="hover:text-primary cursor-pointer"
            onClick={() => window.open('https://github.com', '_blank')}
          />
        </div>
      </motion.div>
    </main>
  )
}
