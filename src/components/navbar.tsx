'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '#home', landingHref: '#home', name: 'Inicio' },
  { href: '#services', landingHref: '#services', name: 'Servicios' },
  { href: '#about', landingHref: '#about', name: 'Sobre Nosotros' },
  { href: '/blog', name: 'Blog' },
  { href: '#contact', landingHref: '#contact', name: 'Contacto' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === '/';

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    if (!isLandingPage) return;

    const sections = navItems
      .filter((item) => item.landingHref)
      .map((item) => ({
        id: item.landingHref?.slice(1),
        element: document.getElementById(item.landingHref?.slice(1) || ''),
      }))
      .filter(({ element }) => element);

    let currentSection = '';
    let minDistance = Infinity;

    sections.forEach(({ id, element }) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < minDistance && rect.top <= window.innerHeight * 0.3 && rect.bottom >= 0) {
        minDistance = distance;
        currentSection = id || '';
      }
    });

    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [isLandingPage, activeSection]);

  useEffect(() => {
    let rafId: number;
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - lastScrollY) > 5) {
          handleScroll();
          lastScrollY = window.scrollY;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  const handleNavigation = useCallback((item: typeof navItems[0]) => {
    if (item.href.startsWith('#')) {
      if (isLandingPage) {
        const element = document.getElementById(item.href.slice(1));
        if (element) {
          const navHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      } else {
        router.push(`/${item.href}`);
      }
    } else {
      router.push(item.href);
    }
    setIsOpen(false);
  }, [isLandingPage, router]);

  const isActiveItem = useCallback(
    (item: typeof navItems[0]) => {
      if (!item.href.startsWith('#')) {
        return pathname === item.href;
      }
      return isLandingPage && activeSection === item.href.slice(1);
    },
    [pathname, isLandingPage, activeSection]
  );

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      } transition-all duration-300`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span>
                Kuhm<span className="text-primary">Dev</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`relative px-4 py-2 rounded-md transition-colors ${
                    isActiveItem(item)
                      ? 'text-primary'
                      : 'text-foreground/60 hover:text-foreground/80'
                  }`}
                >
                  {item.name}
                  {isActiveItem(item) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-primary"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              </motion.div>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 hover:bg-muted cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <motion.div key={item.name} whileHover={{ x: 4 }} whileTap={{ x: 0 }}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`block text-sm font-medium transition-colors ${
                          isActiveItem(item)
                            ? 'text-primary'
                            : 'text-foreground/60 hover:text-foreground/80'
                        }`}
                      >
                        {item.name}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
