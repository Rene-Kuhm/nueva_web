'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, 45])

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          y,
          opacity,
          scale,
          rotateX,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 text-6xl font-bold tracking-tight text-foreground md:text-8xl"
            >
              Nueva Web
              <span className="text-primary">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl"
            >
              Creando experiencias web únicas y memorables
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center space-x-4"
            >
              <div className="h-1 w-1 rounded-full bg-primary" />
              <div className="h-1 w-1 rounded-full bg-primary" />
              <div className="h-1 w-1 rounded-full bg-primary" />
            </motion.div>
          </div>
        </div>
        
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-40 w-40 rounded-full bg-primary/5"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 2 + 0.5,
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
