'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Newsletter } from './newsletter';

const socialLinks = [
  {
    icon: Facebook,
    href: 'https://www.facebook.com/TecnoDespegueLive',
    name: 'Facebook',
  },
  {
    icon: Twitter,
    href: 'https://x.com/REPARO22',
    name: 'Twitter',
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/renekuhm/',
    name: 'Instagram',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/ren%C3%A9-kuhm-1aa88818a/',
    name: 'LinkedIn',
  },
  {
    icon: Github,
    href: 'https://github.com/Rene-Kuhm',
    name: 'GitHub',
  },
];

const footerNavItems = [
  {
    title: 'Navegación',
    links: [
      { name: 'Inicio', href: '/#home' },
      { name: 'Servicios', href: '/#services' },
      { name: 'Sobre Nosotros', href: '/#about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contacto', href: '/#contact' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Términos de Servicio', href: '/terms' },
      { name: 'Preguntas Frecuentes', href: '/faq' },
    ],
  },
];

export function Footer() {
  // Use a static year to prevent hydration mismatch
  const currentYear = 2024;

  // Prevent hydration mismatch with social links
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="bg-background/80 backdrop-blur-lg border-t border-border/50 py-12 w-full">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full">
        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">
              Kuhm<span className="text-primary">Dev</span>
            </span>
          </div>
          <p className="text-foreground/70 text-sm mb-4">
            Transformamos ideas en soluciones digitales innovadoras. Desarrollamos aplicaciones web
            y móviles que impulsan tu negocio.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {isMounted &&
              socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {footerNavItems.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground/80">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-foreground/60 hover:text-primary text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground/80">Contacto</h4>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>Email: contacto@kuhmdev.com</p>
              <p>Teléfono: +54 (02334) 409838</p>
              <p>Dirección: Eduardo Castex (La Pampa), Argentina</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-border/20 text-center w-full">
        <p className="text-xs text-foreground/50">
          {currentYear} KuhmDev. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
