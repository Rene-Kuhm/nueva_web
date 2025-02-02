'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/#home', name: 'Inicio' },
  { href: '/#services', name: 'Servicios' },
  { href: '/#about', name: 'Sobre Nosotros' },
  { href: '/blog', name: 'Blog' },
  { href: '/#contact', name: 'Contacto' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-lg shadow-lg transition-all duration-300"
    >
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span>
                Kuhm<span className="text-primary">Dev</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`
                  px-4 py-2 rounded-md transition-colors 
                  ${pathname === item.href ? 'text-primary' : 'text-foreground/60 hover:text-foreground/80'}
                `}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              className="rounded-lg p-2 hover:bg-muted cursor-pointer"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div 
            className="md:hidden bg-background absolute left-0 right-0 top-16 shadow-lg"
            onClick={closeMenu}
          >
            <div className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    block py-3 border-b last:border-b-0 
                    ${pathname === item.href ? 'text-primary' : 'text-foreground/80'}
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
