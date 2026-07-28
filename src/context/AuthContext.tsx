import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { initGeminiAPI } from '../services/gemini';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  geminiApiKey: string;
  saveGeminiApiKey: (key: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // 1. Cargar clave de Gemini e iniciar sesión persistente al abrir la app
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        // Cargar clave guardada o clave desde .env
        const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        const savedKey = await AsyncStorage.getItem('MAWI_GEMINI_API_KEY');
        const activeKey = savedKey || envKey;

        if (activeKey) {
          setGeminiApiKey(activeKey);
          initGeminiAPI(activeKey);
        }

        // Cargar sesión de usuario persistente
        const savedUser = await AsyncStorage.getItem('MAWI_PERSISTENT_USER');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.warn('Error al cargar sesión persistente:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialState();
  }, []);

  const saveGeminiApiKey = async (key: string) => {
    setGeminiApiKey(key);
    initGeminiAPI(key);
    await AsyncStorage.setItem('MAWI_GEMINI_API_KEY', key);
  };

  const signInWithGoogle = async () => {
    try {
      // Intenta OAuth vía Supabase o simula inicio de sesión persistente con Google para pruebas
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'mawi://auth/callback',
        },
      });

      if (error) {
        // Fallback simulado de sesión Google persistente para tus amigos/pruebas
        const mockGoogleUser: UserProfile = {
          id: `usr-google-${Date.now()}`,
          email: 'usuario.mawi@gmail.com',
          name: 'Amigo Mawi',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
        };
        setUser(mockGoogleUser);
        await AsyncStorage.setItem('MAWI_PERSISTENT_USER', JSON.stringify(mockGoogleUser));
      }
    } catch (e) {
      const mockGoogleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        email: 'amigo.fashion@gmail.com',
        name: 'Invitado Mawi',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      };
      setUser(mockGoogleUser);
      await AsyncStorage.setItem('MAWI_PERSISTENT_USER', JSON.stringify(mockGoogleUser));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    await AsyncStorage.removeItem('MAWI_PERSISTENT_USER');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signOut,
        geminiApiKey,
        saveGeminiApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
