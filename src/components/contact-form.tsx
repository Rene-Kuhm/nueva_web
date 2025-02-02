'use client';

import { useState, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: null,
    message: '',
  });

  // Memoized change handler para mejor rendimiento
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Validación de email más robusta
  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      setFormStatus({ type: null, message: '' });

      // Validaciones
      if (!formData.name.trim()) {
        setFormStatus({
          type: 'error',
          message: 'Por favor, ingresa tu nombre',
        });
        return;
      }

      if (!formData.email.trim() || !isValidEmail(formData.email)) {
        setFormStatus({
          type: 'error',
          message: 'Por favor, ingresa un email válido',
        });
        return;
      }

      if (!formData.subject.trim()) {
        setFormStatus({
          type: 'error',
          message: 'Por favor, ingresa un asunto',
        });
        return;
      }

      if (!formData.message.trim()) {
        setFormStatus({
          type: 'error',
          message: 'Por favor, ingresa un mensaje',
        });
        return;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          setFormStatus({
            type: 'success',
            message: 'Mensaje enviado exitosamente. ¡Pronto nos pondremos en contacto!',
          });
        } else {
          setFormStatus({
            type: 'error',
            message: result.error || 'Hubo un problema al enviar el mensaje',
          });
        }
      } catch (networkError) {
        console.error('Network error:', networkError);
        setFormStatus({
          type: 'error',
          message: 'Error de red. Por favor, intenta de nuevo.',
        });
      }
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 max-w-md mx-auto"
      aria-label="Formulario de contacto"
    >
      <Input
        type="text"
        name="name"
        placeholder="Tu nombre"
        value={formData.name}
        onChange={handleChange}
        required
        aria-required="true"
        disabled={isPending}
      />
      <Input
        type="email"
        name="email"
        placeholder="Tu email"
        value={formData.email}
        onChange={handleChange}
        required
        aria-required="true"
        disabled={isPending}
      />
      <Input
        type="text"
        name="subject"
        placeholder="Asunto"
        value={formData.subject}
        onChange={handleChange}
        required
        aria-required="true"
        disabled={isPending}
      />
      <Textarea
        name="message"
        placeholder="Tu mensaje"
        value={formData.message}
        onChange={handleChange}
        required
        aria-required="true"
        disabled={isPending}
        rows={4}
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
      {formStatus.type && (
        <div 
          role="alert"
          className={`p-4 rounded-lg ${
            formStatus.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {formStatus.message}
        </div>
      )}
    </form>
  );
}
