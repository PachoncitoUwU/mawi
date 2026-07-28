import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BlurModal } from './BlurModal';
import { HapticButton } from './HapticButton';
import { Key, LogOut, LogIn, Check, ShieldCheck, User } from 'lucide-react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { user, signInWithGoogle, signOut, geminiApiKey, saveGeminiApiKey } = useAuth();
  const [inputApiKey, setInputApiKey] = useState(geminiApiKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = async () => {
    await saveGeminiApiKey(inputApiKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <BlurModal visible={visible} onClose={onClose} title="Configuración & Sesión">
      <View style={styles.content}>
        {/* User Session Box */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sesión de Usuario Persistente</Text>
        
        {user ? (
          <View style={[styles.userBox, { backgroundColor: colors.secondary }]}>
            <View style={styles.userRow}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
                  <User size={20} color="#FFF" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: colors.subtext }]}>{user.email}</Text>
                <View style={styles.persistentBadge}>
                  <ShieldCheck size={12} color="#10B981" />
                  <Text style={styles.persistentText}>Sesión guardada (Nunca expira)</Text>
                </View>
              </View>
            </View>

            <HapticButton
              title="Cerrar Sesión"
              variant="outline"
              icon={<LogOut size={16} color="#EF4444" />}
              onPress={signOut}
              textStyle={{ color: '#EF4444' }}
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <View style={[styles.loginCard, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.loginDesc, { color: colors.subtext }]}>
              Inicia sesión con Google para sincronizar tu armario y compartir Mawi con tus amigos. Tu sesión permanecerá iniciada para siempre.
            </Text>
            <HapticButton
              title="Iniciar Sesión con Google"
              variant="gold"
              icon={<LogIn size={18} color="#111318" />}
              onPress={signInWithGoogle}
              style={{ marginTop: 10 }}
            />
          </View>
        )}

        {/* Gemini API Key Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Clave de Inteligencia Artificial (Gemini API)</Text>
        <Text style={[styles.apiHelpText, { color: colors.subtext }]}>
          Obtén tu clave de API 100% gratuita en <Text style={{ color: colors.gold }}>aistudio.google.com</Text> y pégala aquí:
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
          placeholder="AIzaSy..."
          placeholderTextColor={colors.subtext}
          secureTextEntry
          value={inputApiKey}
          onChangeText={setInputApiKey}
        />

        <HapticButton
          title={isSaved ? '¡Clave de IA Guardada!' : 'Guardar Clave de IA'}
          variant="primary"
          icon={isSaved ? <Check size={18} color="#10B981" /> : <Key size={18} color="#FFF" />}
          onPress={handleSaveKey}
        />
      </View>
    </BlurModal>
  );
};

const styles = StyleSheet.create({
  content: { gap: 12 },
  sectionTitle: { fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '800' },
  userBox: { padding: 14, borderRadius: 16 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  userEmail: { fontSize: 12, fontFamily: 'Inter' },
  persistentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  persistentText: { fontSize: 10, fontFamily: 'Inter', color: '#10B981', fontWeight: '600' },
  loginCard: { padding: 14, borderRadius: 16, gap: 6 },
  loginDesc: { fontSize: 12, fontFamily: 'Inter', lineHeight: 18 },
  apiHelpText: { fontSize: 12, fontFamily: 'Inter', marginBottom: 4 },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontSize: 14 },
});
