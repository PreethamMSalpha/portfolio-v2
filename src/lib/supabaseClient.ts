import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url: string) => {
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
};

const isConfigured = supabaseUrl && 
                   supabaseAnonKey && 
                   isValidUrl(supabaseUrl) && 
                   supabaseUrl !== 'your_supabase_project_url';

if (!isConfigured) {
    if (import.meta.env.DEV) {
        console.warn('Supabase credentials missing or invalid. Profile visit tracking disabled.');
    }
}

export const supabase = isConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
