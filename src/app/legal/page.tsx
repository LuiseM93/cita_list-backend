import Link from "next/link";

export const metadata = {
  title: "Legal - citalist",
  description: "Términos y Condiciones y Política de Privacidad de citalist.",
};

export default function LegalPage() {
  return (
    <div className="app-container p-edge-margin bg-background min-h-screen text-on-background">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-primary font-button-text hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver a inicio
        </Link>
        <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">citalist</span>
      </header>
      
      <h1 className="sr-only">Términos y Privacidad - citalist</h1>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-low flex flex-col gap-8">
        
        {/* Política de Privacidad */}
        <section id="privacidad" className="flex flex-col gap-4 scroll-mt-24">
          <h2 className="font-display-lg text-2xl font-bold">Política de Privacidad</h2>
          <p className="font-body-md text-on-surface-variant">Última actualización: Julio 2026</p>
          
          <div className="font-body-md space-y-4 text-on-surface">
            <p>Bienvenido a citalist. Respetamos tu privacidad y estamos comprometidos a proteger tus datos personales. Esta política explica cómo manejamos tu información al usar nuestra aplicación.</p>
            
            <h3 className="font-bold text-[16px]">1. Almacenamiento Local (Versión Gratuita)</h3>
            <p>En nuestra versión gratuita (Invitado), <strong>todos tus datos de citas, clientes y plantillas se almacenan de forma local en tu dispositivo (LocalStorage)</strong>. Nosotros no tenemos acceso a esta información, no se envía a nuestros servidores y no compartimos estos datos con terceros. Eres completamente responsable de respaldar esta información.</p>
            
            <h3 className="font-bold text-[16px]">2. Cuentas Registradas y Almacenamiento en la Nube (Supabase)</h3>
            <p>Si decides crear una cuenta (gratuita o de pago), los datos de tus citas y clientes se sincronizarán y guardarán de forma segura en nuestra infraestructura en la nube (proveída por Supabase). Usamos protocolos de seguridad estándar (Row Level Security) para asegurar que solo tú puedas acceder a tu agenda.</p>
            
            <h3 className="font-bold text-[16px]">3. Procesamiento de Pagos (Stripe)</h3>
            <p>Los pagos para planes Premium son procesados exclusivamente a través de <strong>Stripe</strong>. citalist no almacena ni tiene acceso a los detalles de tu tarjeta de crédito o débito.</p>
          </div>
        </section>

        <hr className="border-surface-container-high" />

        {/* Términos y Condiciones */}
        <section id="terminos" className="flex flex-col gap-4 scroll-mt-24">
          <h2 className="font-display-lg text-2xl font-bold">Términos y Condiciones</h2>
          
          <div className="font-body-md space-y-4 text-on-surface">
            <p>Al utilizar citalist, un Micro-SaaS enfocado al mercado mexicano, aceptas los siguientes términos de servicio:</p>
            
            <h3 className="font-bold text-[16px]">1. Uso del Servicio</h3>
            <p>citalist es una herramienta diseñada para facilitar el registro de citas y el envío de recordatorios mediante enlaces directos a WhatsApp (wa.me). No somos una aplicación afiliada a Meta o WhatsApp Inc.</p>
            
            <h3 className="font-bold text-[16px]">2. Responsabilidad de Envíos</h3>
            <p>Tú (el usuario) eres el único responsable de los mensajes enviados a través de WhatsApp a tus clientes usando nuestra herramienta de pre-llenado. citalist no envía mensajes de forma automatizada ni masiva desde nuestros servidores.</p>
            
            <h3 className="font-bold text-[16px]">3. Limitación de Responsabilidad</h3>
            <p>Para los usuarios de la versión sin registro (Invitados), citalist no se hace responsable por la pérdida de datos derivada del borrado de caché del navegador o daño del dispositivo, ya que todo se guarda de manera local. Recomendamos crear una cuenta para la sincronización en la nube.</p>
            
            <h3 className="font-bold text-[16px]">4. Pagos y Suscripciones</h3>
            <p>Las suscripciones mensuales y los pagos de "Acceso Vitalicio" no son reembolsables una vez activados, a menos que exista una falla técnica comprobable por parte de nuestro sistema.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
