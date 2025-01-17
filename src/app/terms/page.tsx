export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">Términos de Servicio</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Aceptación de Términos</h2>
        <p className="text-foreground/80 mb-4">
          Al utilizar los servicios de KuhmDev, usted acepta estos términos en su totalidad. 
          Si no está de acuerdo, le recomendamos no utilizar nuestros servicios.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Descripción de Servicios</h2>
        <p className="text-foreground/80 mb-4">
          KuhmDev ofrece servicios de desarrollo de software, consultoría tecnológica 
          y soluciones web personalizadas para empresas y emprendedores.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Propiedad Intelectual</h2>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Todos los derechos de propiedad intelectual de nuestros servicios nos pertenecen</li>
          <li>Los clientes reciben una licencia de uso limitada para los productos desarrollados</li>
          <li>No se permite la reproducción o distribución sin autorización</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Responsabilidades del Cliente</h2>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Proporcionar información precisa y actualizada</li>
          <li>Mantener la confidencialidad de credenciales de acceso</li>
          <li>Utilizar nuestros servicios de manera ética y legal</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Limitación de Responsabilidad</h2>
        <p className="text-foreground/80 mb-4">
          KuhmDev no se hace responsable por:
        </p>
        <ul className="list-disc list-inside text-foreground/70 space-y-2">
          <li>Pérdidas indirectas o consecuenciales</li>
          <li>Daños derivados del uso inadecuado de nuestros servicios</li>
          <li>Interrupciones del servicio por causas ajenas a nuestra voluntad</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Modificaciones</h2>
        <p className="text-foreground/80">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. 
          Las modificaciones serán efectivas inmediatamente después de su publicación.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">7. Contacto</h2>
        <p className="text-foreground/80">
          Para consultas sobre estos términos:
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
