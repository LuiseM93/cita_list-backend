import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Appointment {
  id: string;
  clientName: string;
  countryCode: string;
  phone: string;
  time: string;
  createdAt: number;
}

const DEFAULT_TEMPLATE = "¡Hola {nombre}! Te recuerdo tu cita para hoy a las {hora}. ¿Me confirmas si todo en orden para reservar tu lugar? ¡Gracias!";

export function useAppointments(session: Session | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (session) {
        // Load from Supabase
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('custom_template')
            .eq('id', session.user.id)
            .single();
            
          if (profile?.custom_template) {
            setTemplate(profile.custom_template);
          }

          const { data: apps, error: appsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', session.user.id)
            .order('appointment_time', { ascending: true });

          if (apps) {
            setAppointments(apps.map(a => ({
              id: a.id,
              clientName: a.client_name,
              countryCode: a.country_code,
              phone: a.phone,
              time: a.appointment_time,
              createdAt: new Date(a.created_at).getTime()
            })));
          }

          if (profileError) {
             console.error("Error al cargar perfil:", profileError.message);
          }
          if (appsError) {
             console.error("Error al cargar citas:", appsError.message);
          }
        } catch (e: any) {
          console.error("Error loading from Supabase", e.message || e);
        }
      } else {
        // Load from local storage
        const savedAppointments = localStorage.getItem('citalist_appointments');
        const savedTemplate = localStorage.getItem('citalist_template');
        
        if (savedAppointments) {
          try {
            setAppointments(JSON.parse(savedAppointments));
          } catch (e) {
            console.error("Error parsing appointments", e);
          }
        } else {
          setAppointments([]);
        }
        
        if (savedTemplate) {
          setTemplate(savedTemplate);
        } else {
          setTemplate(DEFAULT_TEMPLATE);
        }
      }
      setIsLoaded(true);
    }
    loadData();
  }, [session]);

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (session) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            user_id: session.user.id,
            client_name: appointment.clientName,
            country_code: appointment.countryCode,
            phone: appointment.phone,
            appointment_time: appointment.time,
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error al guardar la cita en Supabase:", error.message);
          alert(`Error al guardar la cita: ${error.message}`);
          return;
        }

        if (data) {
          setAppointments(prev => {
            const newList = [...prev, {
              id: data.id,
              clientName: data.client_name,
              countryCode: data.country_code,
              phone: data.phone,
              time: data.appointment_time,
              createdAt: new Date(data.created_at).getTime()
            }];
            return newList.sort((a, b) => a.time.localeCompare(b.time));
          });
        }
      } catch (err: any) {
        console.error("Excepción al guardar la cita:", err);
        alert(`Error inesperado: ${err.message}`);
      }
    } else {
      const newAppointment: Appointment = {
        ...appointment,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      
      setAppointments(prev => {
        const newList = [...prev, newAppointment];
        const sorted = newList.sort((a, b) => a.time.localeCompare(b.time));
        try { localStorage.setItem('citalist_appointments', JSON.stringify(sorted)); } catch (e) { /* incognito */ }
        return sorted;
      });
    }
  };

  const deleteAppointment = async (id: string) => {
    if (session) {
      await supabase.from('appointments').delete().eq('id', id);
      setAppointments(prev => prev.filter(app => app.id !== id));
    } else {
      setAppointments(prev => {
        const filtered = prev.filter(app => app.id !== id);
        try { localStorage.setItem('citalist_appointments', JSON.stringify(filtered)); } catch (e) { /* incognito */ }
        return filtered;
      });
    }
  };

  const updateTemplate = async (newTemplate: string) => {
    setTemplate(newTemplate); // Optimistic update
    if (session) {
      try {
        const { error } = await supabase.from('profiles').update({ custom_template: newTemplate }).eq('id', session.user.id);
        if (error) {
          console.error("Error al actualizar la plantilla en Supabase:", error.message);
          alert(`Error al guardar la plantilla: ${error.message}`);
        }
      } catch (err: any) {
        console.error("Excepción al actualizar la plantilla:", err);
        alert(`Error inesperado: ${err.message}`);
      }
    } else {
      try { localStorage.setItem('citalist_template', newTemplate); } catch (e) { /* incognito */ }
    }
  };

  return {
    appointments,
    addAppointment,
    deleteAppointment,
    template,
    updateTemplate,
    isLoaded
  };
}
