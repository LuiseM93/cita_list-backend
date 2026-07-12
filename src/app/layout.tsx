import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://citalist.site'),
  title: "citalist - Agenda gratis para barberías y uñas con recordatorios de WhatsApp",
  description: "La agenda digital más rápida y sencilla para barberías, estéticas y salones de uñas en México. Registra citas y envía recordatorios por WhatsApp a un clic.",
  keywords: "agenda barberia gratis, recordatorios whatsapp citas, control de citas uñas, agenda estilistas mexico, citalist",
  icons: {
    icon: [
      { url: '/assets/favicon.ico' },
      { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: "citalist | Agenda gratis con recordatorios de WhatsApp",
    description: "Organiza tu día y evita que tus clientes olviden su cita. Diseñado para barberos y estilistas en México.",
    url: "https://citalist.site",
    siteName: "citalist",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "citalist - Agenda gratis con recordatorios por WhatsApp",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "citalist",
    "url": "https://citalist.site",
    "description": "Herramienta web mobile-first para agendar citas y enviar recordatorios por WhatsApp.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "MXN"
    }
  };

  return (
    <html
      lang="es"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="text-on-background antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-130YC3GP9G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-130YC3GP9G');
          `}
        </Script>
        
        <div className="app-container flex flex-col relative pb-[120px]">
          {children}
        </div>
      </body>
    </html>
  );
}
