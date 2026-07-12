"use client";

import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/hooks/useAuth";

interface HeaderProps {
  session: Session | null;
  profile: Profile | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ session, profile, onLoginClick, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 flex justify-between items-center px-edge-margin h-touch-target-min max-w-[480px] bg-surface/90 backdrop-blur-md">
      {!session ? (
        /* State 1: Guest */
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">citalist</span>
            <span className="bg-surface-variant text-on-surface-variant font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold opacity-80">Gratis</span>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              className="text-primary font-button-text text-[14px] px-3 py-1.5 hover:bg-primary-container/50 rounded-lg transition-colors font-semibold" 
              onClick={onLoginClick}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      ) : profile?.plan === "pro" || profile?.plan === "monthly" ? (
        /* State 3: PRO Plan */
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">citalist</span>
            <div className="flex items-center gap-1 bg-gradient-to-r from-primary to-primary-container text-white font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
              <span>PRO</span>
              <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={onLogout}
              aria-label="profile" 
              className="text-primary hover:opacity-80 transition-opacity scale-95 active:transition-transform h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 bg-primary-container/30"
            >
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </button>
          </div>
        </div>
      ) : (
        /* State 2: Basic Plan */
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">citalist</span>
            <div className="flex items-center gap-1 bg-surface-variant text-on-surface-variant font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              <span>Plan Básico</span>
              <span className="material-symbols-outlined text-[12px]">cloud_off</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={onLogout}
              aria-label="profile" 
              className="text-primary hover:opacity-80 transition-opacity scale-95 active:transition-transform h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 bg-primary-container/30"
            >
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
