import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sujxkveawqiblofqvjhk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1anhrdmVhd3FpYmxvZnF2amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODc2NzksImV4cCI6MjA5OTE2MzY3OX0.8Us9vzCi9Ye6TkaNb2W2L5u_4qssx7kYCukHp5zif-0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
