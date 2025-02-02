'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error: unknown) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
    }
  };

  return (
    <div className="bg-background/10 rounded-lg p-6 border border-border/30 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">
        Mantente Actualizado
      </h3>
      <p className="text-xs text-foreground/60 mb-4 flex-grow">
        Suscríbete a nuestro newsletter y recibe las últimas tendencias en desarrollo web y tecnología.
      </p>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-grow">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSubscriptionStatus('idle');
            }}
            className="w-full px-3 py-2 text-sm border border-border/50 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 
                       bg-background text-foreground/80"
          />
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-md transition-colors text-sm
                      ${subscriptionStatus === 'success' 
                        ? 'bg-green-500 text-white' 
                        : subscriptionStatus === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-primary text-background hover:bg-primary/90'}`}
        >
          {subscriptionStatus === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : subscriptionStatus === 'error' ? (
            '!'
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </form>

      {subscriptionStatus === 'success' && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-600 text-xs mt-2"
        >
          ¡Gracias por suscribirte! Pronto recibirás novedades.
        </motion.p>
      )}

      {subscriptionStatus === 'error' && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-xs mt-2"
        >
          Por favor, ingresa un correo electrónico válido.
        </motion.p>
      )}
    </div>
  );
}
