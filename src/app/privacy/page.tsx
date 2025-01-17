export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">Política de Privacidad</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Información que Recopilamos</h2>
        <p className="text-foreground/80 mb-4">
          En KuhmDev, nos comprometemos a proteger su privacidad. Recopilamos información 
          personal únicamente con su consentimiento y para mejorar nuestros servicios.
        </p>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Información de contacto proporcionada voluntariamente</li>
          <li>Datos de navegación y uso del sitio web</li>
          <li>Información de comunicaciones y soporte</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Uso de la Información</h2>
        <p className="text-foreground/80 mb-4">
          Utilizamos su información para:
        </p>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Proporcionar y mejorar nuestros servicios</li>
          <li>Comunicarnos con usted</li>
          <li>Responder a consultas y solicitudes</li>
          <li>Cumplir con obligaciones legales</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Protección de Datos</h2>
        <p className="text-foreground/80 mb-4">
          Implementamos medidas de seguridad técnicas y organizativas para proteger 
          su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Sus Derechos</h2>
        <p className="text-foreground/80 mb-4">
          Usted tiene derecho a:
        </p>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Acceder a sus datos personales</li>
          <li>Solicitar corrección de información inexacta</li>
          <li>Solicitar eliminación de sus datos</li>
          <li>Oponerse al tratamiento de sus datos</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">5. Contacto</h2>
        <p className="text-foreground/80">
          Si tiene preguntas sobre esta política de privacidad, puede contactarnos a:
          <br />
          <strong>Email:</strong> contacto@kuhmdev.com
        </p>
      </section>

      <p className="mt-8 text-sm text-foreground/60">
        Última actualización: Enero 2024
      </p>
    </div>
  );
}
