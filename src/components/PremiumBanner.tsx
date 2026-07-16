"use client";

import { useState } from "react";
import type { Session } from "@supabase/supabase-js";

interface PremiumBannerProps {
  session: Session | null;
  onLoginRequest: () => void;
  showToast: (msg: string) => void;
}

export default function PremiumBanner({ session, onLoginRequest, showToast }: PremiumBannerProps) {
  const [loadingLifetime, setLoadingLifetime] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  const handleCheckout = async (mode: 'payment' | 'subscription', priceId: string) => {
    if (!session) {
      showToast("Debes iniciar sesión para suscribirte.");
      onLoginRequest();
      return;
    }

    const setLoading = mode === 'payment' ? setLoadingLifetime : setLoadingMonthly;
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: session.user.id,
          mode,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Ocurrió un error al procesar el pago.");
      }
    } catch (e) {
      console.error(e);
      showToast("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 bg-gradient-to-br from-on-tertiary-fixed to-primary-container rounded-xl p-6 text-on-primary shadow-lg relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-wider">Citalist Pro</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-primary">¿Quieres citas ilimitadas y quitar la marca de agua?</h3>
        <p className="font-body-md text-body-md text-on-primary-container/80 pb-2 border-b border-white/20">Citas ilimitadas, plantillas personalizadas y mensajes 100% tuyos.</p>
        
        {/* Option 2: Lifetime (Highlighted) */}
        <div className="bg-surface-container-lowest rounded-xl p-4 text-on-surface flex flex-col gap-2 relative mt-2 border-2 border-primary">
          <div className="absolute -top-3 right-3 bg-error text-on-error font-label-caps text-[10px] px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
            Oferta de Verano
          </div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-headline-sm text-[18px] font-bold text-on-surface">Acceso Vitalicio</span>
              <span className="font-body-md text-sm text-on-surface-variant">Pago único · Mientras exista el servicio</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline-sm text-primary font-bold">$499 MXN</span>
            </div>
          </div>
          <div className="bg-secondary-container/50 p-2 rounded-lg mt-1 border border-secondary-container">
            <span className="font-body-md text-[13px] text-secondary flex items-start gap-1 leading-snug">
              <span className="material-symbols-outlined text-[16px] text-primary">info</span>
              Acceso ilimitado a la versión actual con un solo pago. Sin cargos mensuales.
            </span>
          </div>
          <button 
            disabled={loadingLifetime}
            onClick={() => handleCheckout('payment', 'price_1TrWvN1E63kseKczSWq8yzzE')}
            className="w-full mt-1 bg-primary text-on-primary font-button-text text-button-text h-[44px] rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-70"
          >
            {loadingLifetime ? 'Redirigiendo...' : 'Obtener Acceso Vitalicio'}
          </button>
        </div>
        
        {/* Option 1: Monthly */}
        <div className="bg-surface-container-low/20 rounded-xl p-4 text-on-primary flex flex-col gap-2 border border-white/20 hover:bg-surface-container-low/30 transition-colors mt-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-headline-sm text-[16px] font-semibold text-on-primary">Plan Mensual</span>
              <span className="font-body-md text-sm text-on-primary-container/80">(Ideal para probar)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline-sm text-on-primary font-bold">$99 MXN<span className="text-sm font-normal">/mes</span></span>
            </div>
          </div>
          <button 
            disabled={loadingMonthly}
            onClick={() => handleCheckout('subscription', 'price_1TrWwn1E63kseKcz0CL0RJrw')}
            className="w-full mt-2 bg-transparent border border-on-primary text-on-primary font-button-text text-button-text h-[44px] rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-70"
          >
            {loadingMonthly ? 'Redirigiendo...' : 'Suscribirse Mensualmente'}
          </button>
        </div>
      </div>
    </section>
  );
}
