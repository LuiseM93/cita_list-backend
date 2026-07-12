"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SettingsAccordionProps {
  template: string;
  onUpdateTemplate: (template: string) => void;
  showToast: (message: string) => void;
}

export default function SettingsAccordion({ template, onUpdateTemplate, showToast }: SettingsAccordionProps) {
  const [localTemplate, setLocalTemplate] = useState(template);
  const { profile } = useAuth();
  
  const isFree = !profile || profile.plan === 'free';

  useEffect(() => {
    setLocalTemplate(template);
  }, [template]);

  const handleSave = () => {
    onUpdateTemplate(localTemplate);
    showToast("Plantilla guardada correctamente.");
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-surface-container-low overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
      <details className="group">
        <summary className="flex justify-between items-center p-4 cursor-pointer font-headline-sm text-headline-sm text-on-surface list-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">chat_bubble</span>
            Mensaje de Recordatorio
          </div>
          <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
        </summary>
        <div className="p-4 pt-0 border-t border-surface-container-low flex flex-col gap-3">
          <p className="font-body-md text-body-md text-on-surface-variant">Personaliza el mensaje que se enviará por WhatsApp. Usa {"{nombre}"} y {"{hora}"} como variables.</p>
          <textarea 
            className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
            value={localTemplate}
            onChange={(e) => setLocalTemplate(e.target.value)}
            disabled={isFree}
          />
          {isFree && (
            <p className="text-error text-sm">🔒 Actualiza a PRO para editar tu plantilla</p>
          )}
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isFree}
              className="text-primary font-button-text text-button-text px-4 py-2 hover:bg-primary-container/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Plantilla
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}
