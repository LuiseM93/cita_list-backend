"use client";

import { useState } from "react";
import type { Appointment } from "@/hooks/useAppointments";

import { useAuth } from "@/hooks/useAuth";

interface AppointmentFormProps {
  onAdd: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  showToast: (message: string) => void;
  appointments: Appointment[];
}

export default function AppointmentForm({ onAdd, showToast, appointments }: AppointmentFormProps) {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+52");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  
  const { profile } = useAuth();
  const isFree = !profile || profile.plan === 'free';

  const handleSubmit = () => {
    if (!name || !phone || !time) {
      showToast("Por favor, completa todos los campos.");
      return;
    }

    if (phone.length < 10) {
      showToast("El teléfono debe tener al menos 10 dígitos.");
      return;
    }

    if (isFree) {
      const today = new Date();
      const todayCount = appointments.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.getDate() === today.getDate() &&
               appDate.getMonth() === today.getMonth() &&
               appDate.getFullYear() === today.getFullYear();
      }).length;

      if (todayCount >= 5) {
        showToast("Has alcanzado el límite de 5 citas gratuitas por día. ¡Actualiza a PRO para registrar citas ilimitadas!");
        return;
      }
    }

    onAdd({ clientName: name, countryCode, phone, time });
    
    // Reset form
    setName("");
    setPhone("");
    setTime("");
    showToast("Cita agregada correctamente.");
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-surface-container-low flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="name">Nombre del Cliente</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" 
              id="name" 
              placeholder="Ej. Carlos Gómez" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-1/3">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="country_code">Lada</label>
            <select 
              className="w-full px-3 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px] appearance-none" 
              id="country_code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+52">+52 (MX)</option>
              <option value="+1">+1 (US)</option>
              <option value="+34">+34 (ES)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-2/3">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="phone">Teléfono</label>
            <input 
              className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" 
              id="phone" 
              placeholder="10 dígitos" 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="time">Hora de la Cita</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">schedule</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" 
              id="time" 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button 
        onClick={handleSubmit}
        className="w-full bg-primary text-on-primary font-button-text text-button-text h-[52px] rounded-xl flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm"
      >
        <span className="material-symbols-outlined">add</span>
        Agregar a la Lista
      </button>
    </section>
  );
}
