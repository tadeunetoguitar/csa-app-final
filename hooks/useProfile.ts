import { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  has_access: boolean;
  full_name?: string;
  phone?: string;
}

export const useProfile = (session: Session | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, has_access, full_name, phone')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // Ignore error for no rows found
            throw error;
          }
          
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [session]);

  return { profile, loading };
};