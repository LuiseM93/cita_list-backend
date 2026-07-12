"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AppointmentForm from "@/components/AppointmentForm";
import SettingsAccordion from "@/components/SettingsAccordion";
import AppointmentList from "@/components/AppointmentList";
import PremiumBanner from "@/components/PremiumBanner";
import Footer from "@/components/Footer";
import AuthModals from "@/components/AuthModals";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  const { session, profile, isAuthLoading, logout } = useAuth();
  const { appointments, addAppointment, deleteAppointment, template, updateTemplate, isLoaded } = useAppointments(session);
  
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const success = url.searchParams.get("success");
      const canceled = url.searchParams.get("canceled");

      if (success) {
        showToast("¡Pago exitoso! Bienvenido a Citalist Pro 🎉");
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.toString());
      } else if (canceled) {
        showToast("Pago cancelado. Puedes suscribirte cuando gustes.");
        url.searchParams.delete("canceled");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  // Close modals automatically when session becomes active
  useEffect(() => {
    if (session) {
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [session]);

  return (
    <>
      <Header 
        session={session} 
        profile={profile} 
        onLoginClick={() => setShowLogin(true)} 
        onLogout={logout}
      />
      
      <main className="flex-grow pt-[80px] px-edge-margin flex flex-col gap-stack-gap-lg">
        <Hero />
        
        {!isAuthLoading && isLoaded && (
          <>
            <AppointmentForm appointments={appointments} onAdd={addAppointment} showToast={showToast} />
            
            <SettingsAccordion 
              template={template} 
              onUpdateTemplate={updateTemplate} 
              showToast={showToast} 
            />
            
            <AppointmentList 
              appointments={appointments} 
              template={template} 
              onDelete={deleteAppointment} 
            />
          </>
        )}
        
        {!isAuthLoading && profile?.plan !== 'pro' && profile?.plan !== 'monthly' && (
          <PremiumBanner 
            session={session} 
            onLoginRequest={() => setShowLogin(true)} 
            showToast={showToast} 
          />
        )}

        <section className="mt-12 mb-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-headline-sm text-headline-sm text-on-background mb-4 text-center">Preguntas Frecuentes</h2>
          <div className="flex flex-col gap-2">
            <details className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant group">
              <summary className="font-body-lg text-body-lg text-on-surface font-semibold cursor-pointer list-none flex justify-between items-center">
                <h3>¿Cómo funciona la agenda de citalist?</h3>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                Es una herramienta web diseñada para que registres el nombre, teléfono y hora de tus clientes. Con un solo clic, se genera un mensaje de WhatsApp personalizado para confirmar su asistencia, reduciendo las citas perdidas hasta en un 80%.
              </p>
            </details>
            <details className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant group">
              <summary className="font-body-lg text-body-lg text-on-surface font-semibold cursor-pointer list-none flex justify-between items-center">
                <h3>¿Tengo que pagar para usar la agenda?</h3>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                No, el plan básico es 100% gratuito y tus datos se guardan en tu celular de forma segura. Si necesitas sincronizar tu agenda en varios dispositivos o agregar el logotipo de tu negocio, puedes adquirir el Plan Pro.
              </p>
            </details>
            <details className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant group">
              <summary className="font-body-lg text-body-lg text-on-surface font-semibold cursor-pointer list-none flex justify-between items-center">
                <h3>¿citalist es compatible con cualquier celular en México?</h3>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                Sí, al ser una aplicación web, funciona perfectamente en cualquier dispositivo Android, iPhone o computadora sin necesidad de descargar nada de la Play Store o App Store.
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModals 
        showLogin={showLogin} 
        showRegister={showRegister} 
        onClose={() => { setShowLogin(false); setShowRegister(false); }}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        showToast={showToast}
      />

      {/* Simple Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg shadow-lg z-[110] font-body-md whitespace-nowrap transition-all duration-300">
          {toastMessage}
        </div>
      )}
    </>
  );
}
