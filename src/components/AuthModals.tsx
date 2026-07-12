"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthModalsProps {
  showLogin: boolean;
  showRegister: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
  showToast: (msg: string) => void;
}

export default function AuthModals({ showLogin, showRegister, onClose, onSwitchToRegister, onSwitchToLogin, showToast }: AuthModalsProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState(""); // We won't use it now, but keeping for future
  const [loading, setLoading] = useState(false);

  if (!showLogin && !showRegister) return null;

  const handleLogin = async () => {
    if (!email || !password) return showToast("Llena todos los campos.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message);
      } else {
        showToast("Sesión iniciada.");
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      showToast("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) return showToast("Llena todos los campos.");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        showToast(error.message);
        return;
      }
      
      // Perform Data Migration if successful
      if (data.user) {
        const savedAppointments = localStorage.getItem('citalist_appointments');
        const savedTemplate = localStorage.getItem('citalist_template');

        // Update custom template if present (profile is created by DB trigger)
        if (savedTemplate) {
          await supabase.from('profiles').update({
            custom_template: savedTemplate
          }).eq('id', data.user.id);
        }

        if (savedAppointments) {
          try {
            const apps = JSON.parse(savedAppointments);
            if (apps.length > 0) {
              const inserts = apps.map((a: any) => ({
                user_id: data.user!.id,
                client_name: a.clientName,
                country_code: a.countryCode,
                phone: a.phone,
                appointment_time: a.time,
              }));
              await supabase.from('appointments').insert(inserts);
              localStorage.removeItem('citalist_appointments'); // Clear after migrate
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (savedTemplate) {
          localStorage.removeItem('citalist_template');
        }

        showToast("Cuenta creada exitosamente. Datos sincronizados.");
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      showToast("Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-[400px] shadow-2xl flex flex-col gap-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col gap-2 text-center mt-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">Bienvenido a citalist</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Sincroniza tus citas de hoy en la nube y accede desde cualquier dispositivo.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Correo Electrónico</label>
                <input 
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" placeholder="correo@ejemplo.com" type="email"/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Contraseña</label>
                <input 
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" placeholder="••••••••" type="password"/>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button disabled={loading} onClick={handleLogin} className="w-full bg-primary text-on-primary font-button-text text-button-text h-[52px] rounded-xl flex items-center justify-center hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm">
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>
            <div className="text-center">
              <button 
                className="font-body-md text-body-md text-primary hover:underline" 
                onClick={onSwitchToRegister}
              >
                ¿No tienes cuenta? Regístrate gratis aquí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-[400px] shadow-2xl flex flex-col gap-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col gap-2 text-center mt-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">Crea tu cuenta gratis</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Tus datos se guardarán de forma segura en la nube.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Nombre del Negocio</label>
                <input 
                  value={businessName} onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" placeholder="Ej. Barbería Imperio" type="text"/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Correo Electrónico</label>
                <input 
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" placeholder="correo@ejemplo.com" type="email"/>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Contraseña</label>
                <input 
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-[52px]" placeholder="Mínimo 6 caracteres" type="password"/>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button disabled={loading} onClick={handleRegister} className="w-full bg-primary text-on-primary font-button-text text-button-text h-[52px] rounded-xl flex items-center justify-center hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm">
                {loading ? 'Creando...' : 'Crear Cuenta Gratis'}
              </button>
            </div>
            <div className="text-center">
              <button 
                className="font-body-md text-body-md text-primary hover:underline" 
                onClick={onSwitchToLogin}
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
