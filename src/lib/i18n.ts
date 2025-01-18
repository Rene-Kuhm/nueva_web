import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Definir tipos de recursos de idioma
interface ContactTranslations {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  success: string;
  error: string;
}

interface Translations {
  welcome: string;
  home: string;
  about: string;
  projects: string;
  contact: ContactTranslations;
}

interface LanguageResources {
  [language: string]: {
    translation: Translations;
  };
}

// Recursos de idioma
const resources: LanguageResources = {
  es: {
    translation: {
      // Traducciones en español
      welcome: 'Bienvenido',
      home: 'Inicio',
      about: 'Sobre mí',
      projects: 'Proyectos',
      contact: {
        name: 'Nombre',
        email: 'Correo electrónico',
        subject: 'Asunto',
        message: 'Mensaje',
        send: 'Enviar',
        success: 'Mensaje enviado con éxito',
        error: 'Error al enviar el mensaje'
      }
    }
  },
  en: {
    translation: {
      // English translations
      welcome: 'Welcome',
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      contact: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        success: 'Message sent successfully',
        error: 'Error sending message'
      }
    }
  }
};

// Configuración de i18next
export function initI18next(lng: string = 'es') {
  const i18nInstance = createInstance();
  
  i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false // React ya escapa los valores
      },
      supportedLngs: ['es', 'en'],
      load: 'languageOnly',
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage']
      }
    });

  return i18nInstance;
}

// Hook para usar traducciones
export function useTranslation(lng: string = 'es') {
  const i18nInstance = initI18next(lng);
  
  return {
    t: i18nInstance.t,
    i18n: i18nInstance
  };
}

// Función para cambiar idioma
export function changeLanguage(lng: string) {
  const i18nInstance = initI18next();
  i18nInstance.changeLanguage(lng);
}
