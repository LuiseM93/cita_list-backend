import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  plan: 'free' | 'pro' | 'monthly';
  custom_template: string | null;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let profileSubscription: any;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setupRealtime(session.user.id);
      } else {
        setIsAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setupRealtime(session.user.id);
      } else {
        setProfile(null);
        setIsAuthLoading(false);
        if (profileSubscription) {
          supabase.removeChannel(profileSubscription);
        }
      }
    });

    const setupRealtime = (userId: string) => {
      if (profileSubscription) return;
      profileSubscription = supabase
        .channel('profile-updates')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          (payload) => {
            setProfile(payload.new as Profile);
          }
        )
        .subscribe();
    };

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error al obtener perfil desde Supabase:", error.message);
      }

      if (data) {
        setProfile(data);
      }
    } catch (e: any) {
      console.error("Excepción al obtener el perfil:", e.message || e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { session, profile, isAuthLoading, logout };
}
