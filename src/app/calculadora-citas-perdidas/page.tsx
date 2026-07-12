import type { Metadata } from "next";
import CalculadoraClient from "./CalculadoraClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Calculadora: ¿Cuánto pierdes por citas que no llegan? | Citalist",
  description: "Descubre cuánto dinero pierdes al mes por citas que no llegan (no-shows). Calcula tus pérdidas y evítalas con recordatorios WhatsApp de Citalist.",
  alternates: {
    canonical: "https://citalist.site/calculadora-citas-perdidas",
  },
  openGraph: {
    title: "Calculadora: ¿Cuánto pierdes por citas que no llegan? | Citalist",
    description: "Descubre cuánto dinero pierdes al mes por citas que no llegan (no-shows). Calcula tus pérdidas y evítalas con recordatorios WhatsApp de Citalist.",
    url: "https://citalist.site/calculadora-citas-perdidas",
    type: "website",
  },
};

export default function CalculadoraPage() {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculadora de Pérdidas por Citas No Asistidas - Citalist",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "MXN"
    }
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuál es el porcentaje normal de no-shows en la industria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La industria de servicios pierde entre 15% y 25% de sus citas por no-show o inasistencia. Esto varía dependiendo del negocio, pero es una métrica clave a controlar."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo se calcula la pérdida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Se multiplica el ticket promedio por el número de citas totales y por el porcentaje de inasistencia (no-shows). Esto te da la pérdida semanal, que se puede proyectar a nivel mensual y anual."
        }
      },
      {
        "@type": "Question",
        "name": "¿Los recordatorios por WhatsApp realmente reducen los no-shows?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí. Un simple recordatorio puede reducir las inasistencias drásticamente. Al recordarles a los clientes su compromiso, es mucho más probable que asistan o cancelen con tiempo."
        }
      }
    ]
  };

  return (
    <>
      <main className="w-full max-w-[480px] mx-auto min-h-screen px-edge-margin pt-[100px] pb-12 flex flex-col gap-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-headline-md font-headline-md font-bold text-on-surface">
            ¿Cuánto dinero pierde tu negocio por clientes que no llegan a su cita?
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            La industria de servicios pierde entre 15% y 25% de sus citas por no-show. Calcula tus pérdidas reales y descubre cuánto podrías ahorrar.
          </p>
        </div>

        <CalculadoraClient />

        <section className="mt-8 flex flex-col gap-6">
          <h2 className="text-title-lg font-title-lg text-on-surface font-semibold">Preguntas Frecuentes</h2>
          
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl">
              <h3 className="font-title-md font-semibold text-on-surface mb-2">¿Cuál es el porcentaje normal de no-shows en la industria?</h3>
              <p className="text-body-md text-on-surface-variant">La industria de servicios pierde entre 15% y 25% de sus citas por no-show o inasistencia. Esto varía dependiendo del negocio, pero es una métrica clave a controlar.</p>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-xl">
              <h3 className="font-title-md font-semibold text-on-surface mb-2">¿Cómo se calcula la pérdida?</h3>
              <p className="text-body-md text-on-surface-variant">Se multiplica el ticket promedio por el número de citas totales y por el porcentaje de inasistencia (no-shows). Esto te da la pérdida semanal, que se puede proyectar a nivel mensual y anual.</p>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-xl">
              <h3 className="font-title-md font-semibold text-on-surface mb-2">¿Los recordatorios por WhatsApp realmente reducen los no-shows?</h3>
              <p className="text-body-md text-on-surface-variant">Sí. Un simple recordatorio puede reducir las inasistencias drásticamente. Al recordarles a los clientes su compromiso, es mucho más probable que asistan o cancelen con tiempo.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
