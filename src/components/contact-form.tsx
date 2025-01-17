'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: null,
    message: '',
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Por favor, ingresa tu nombre',
      });
      return false;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Por favor, ingresa un email válido',
      });
      return false;
    }

    if (!formData.subject.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Por favor, ingresa un asunto',
      });
      return false;
    }

    if (!formData.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Por favor, ingresa un mensaje',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: null, message: '' });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Aquí iría la lógica de envío del formulario
      // Por ahora simularemos un delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormStatus({
        type: 'success',
        message: '¡Gracias por tu mensaje! Te contactaremos pronto.',
      });

      // Limpiar el formulario después del éxito
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setFormStatus({
        type: 'error',
        message: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-6"
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Input
            name="subject"
            placeholder="Asunto"
            value={formData.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Textarea
            name="message"
            placeholder="Tu mensaje"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            className="min-h-[150px] resize-none"
          />
        </div>
      </div>

      {formStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-3 text-sm',
            formStatus.type === 'success'
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
          )}
        >
          {formStatus.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <p>{formStatus.message}</p>
        </motion.div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Send className="h-4 w-4" />
            </motion.div>
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar mensaje
          </>
        )}
      </Button>
    </motion.form>
  );
}
