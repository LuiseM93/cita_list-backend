"use client";

import type { Appointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";

interface AppointmentListProps {
  appointments: Appointment[];
  template: string;
  onDelete: (id: string) => void;
}

export default function AppointmentList({ appointments, template, onDelete }: AppointmentListProps) {
  const { profile } = useAuth();
  const isFree = !profile || profile.plan === 'free';

  const handleSendWhatsApp = (app: Appointment) => {
    const message = template
      .replace(/{nombre}/g, app.clientName)
      .replace(/{hora}/g, app.time);
    
    // Clean phone (remove spaces/dashes)
    const cleanPhone = app.phone.replace(/\D/g, "");
    // If it's a 10 digit number and a country code is provided in the struct, we can combine. 
    // Wait, countryCode has '+' inside it.
    const fullPhone = `${app.countryCode.replace("+", "")}${cleanPhone}`;
    
    let finalMessage = message;
    if (isFree) {
      finalMessage += "\n\n🔗 Recordatorio enviado con citalist.site (gratis)";
    }
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-end border-b border-surface-container-high pb-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Citas de Hoy</h2>
        <span className="font-label-caps text-label-caps text-secondary uppercase bg-surface-container px-2 py-1 rounded-full">
          {appointments.length} {appointments.length === 1 ? 'Cita' : 'Citas'}
        </span>
      </div>
      
      {appointments.length === 0 && (
        <div className="text-center py-8 text-on-surface-variant font-body-md">
          No tienes citas programadas para hoy.
        </div>
      )}

      {appointments.map(app => (
        <div key={app.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)] border-l-4 border-l-primary flex flex-col gap-3 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">{app.clientName}</span>
              <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">call</span> {app.countryCode} {app.phone}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline-sm text-headline-sm text-primary">{app.time}</span>
              <span className="font-label-caps text-label-caps text-secondary uppercase">Hoy</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-surface-container-low mt-1">
            <button 
              onClick={() => handleSendWhatsApp(app)}
              aria-label={`Enviar mensaje de WhatsApp a ${app.clientName}`}
              className="flex-1 bg-surface-container-highest text-on-surface font-button-text text-button-text h-[44px] rounded-lg flex items-center justify-center gap-2 hover:bg-surface-dim transition-colors"
            >
              <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              Enviar WhatsApp
            </button>
            <button 
              onClick={() => onDelete(app.id)}
              aria-label="Eliminar cita" 
              className="w-[44px] h-[44px] bg-error-container text-on-error-container rounded-lg flex items-center justify-center hover:bg-[#ffb4ab] transition-colors"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
