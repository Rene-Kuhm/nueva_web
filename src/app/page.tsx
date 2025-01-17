'use client'

import { Hero } from '@/components/hero'
import { SmoothScroll } from '@/components/smooth-scroll'

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="relative">
        <Hero />
        
        {/* Sección de contenido con efecto 3D */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-20">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-lg bg-card p-8"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'perspective(1000px)',
                }}
              >
                <div className="relative z-10">
                  <h2 className="mb-4 text-3xl font-bold">Sección {i + 1}</h2>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                    voluptates, quod, voluptatum, quae voluptatibus quibusdam
                    voluptatem quas quos quia quidem nesciunt. Quisquam, quae
                    voluptates. Quisquam, quae voluptates.
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                  style={{
                    transform: 'translateZ(-10px)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
