import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { INITIAL_GARMENTS, INITIAL_AVATAR } from './src/services/mockData';
import { Garment, Outfit } from './src/types';

import { WardrobeView } from './src/modules/wardrobe/WardrobeView';
import { LayeringEngine } from './src/modules/layering/LayeringEngine';
import { Avatar3DView } from './src/modules/avatar3d/Avatar3DView';
import { EvaluatorView } from './src/modules/evaluator/EvaluatorView';
import { AdvisorView } from './src/modules/advisor/AdvisorView';
import { WishlistView } from './src/modules/wishlist/WishlistView';
import { SavedLooksView } from './src/modules/looks/SavedLooksView';
import { SettingsModal } from './src/components/ui/SettingsModal';

import { Shirt, Layers, User, ShoppingBag, Sparkles, Heart, Sun, Moon, Bookmark, Settings } from 'lucide-react-native';

const MainApp = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'layering' | 'avatar' | 'evaluator' | 'advisor' | 'wishlist' | 'looks'>('wardrobe');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [garments, setGarments] = useState<Garment[]>(INITIAL_GARMENTS);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([
    {
      id: 'o-1',
      name: 'Streetwear Alabaster Editorial',
      garments: INITIAL_GARMENTS.slice(0, 4),
      tags: ['streetwear', 'casual', 'noche'],
      occasion: 'Cita Nocturna',
      isFavorite: true,
      createdAt: new Date().toISOString(),
      styleMode: 'atrevido',
      aiExplanation: 'Equilibrio contrastante entre el gorro granate y las capas superiores oscuras.'
    }
  ]);

  const handleAddGarment = (item: Garment) => {
    setGarments(prev => [item, ...prev]);
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    setSavedOutfits(prev => [outfit, ...prev]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      
      {/* Top Brand Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <View style={styles.brandRow}>
          <Text style={[styles.logoText, { color: colors.text }]}>MAWI</Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.gold }]}>
            <Text style={styles.statusText}>{user ? user.name.split(' ')[0].toUpperCase() : 'STUDIO 3D'}</Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          {/* Settings & Auth Modal Button */}
          <Pressable onPress={() => setIsSettingsOpen(true)} style={[styles.themeBtn, { backgroundColor: colors.secondary }]}>
            <Settings size={18} color={colors.text} />
          </Pressable>

          {/* Theme Mode Toggle Button */}
          <Pressable onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: colors.secondary }]}>
            {isDark ? <Sun size={18} color={colors.gold} /> : <Moon size={18} color={colors.text} />}
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.container}>
        {activeTab === 'wardrobe' && (
          <WardrobeView garments={garments} onAddGarment={handleAddGarment} />
        )}
        {activeTab === 'layering' && (
          <LayeringEngine wardrobe={garments} onSaveOutfit={handleSaveOutfit} />
        )}
        {activeTab === 'avatar' && (
          <Avatar3DView initialAvatar={INITIAL_AVATAR} activeOutfitGarments={garments.slice(0, 4)} />
        )}
        {activeTab === 'evaluator' && (
          <EvaluatorView wardrobe={garments} />
        )}
        {activeTab === 'advisor' && (
          <AdvisorView wardrobe={garments} onSaveOutfit={handleSaveOutfit} />
        )}
        {activeTab === 'wishlist' && (
          <WishlistView wardrobe={garments} />
        )}
        {activeTab === 'looks' && (
          <SavedLooksView savedOutfits={savedOutfits} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.navBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable onPress={() => setActiveTab('wardrobe')} style={styles.navItem}>
          <Shirt size={20} color={activeTab === 'wardrobe' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'wardrobe' ? colors.gold : colors.subtext }]}>
            Armario
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('layering')} style={styles.navItem}>
          <Layers size={20} color={activeTab === 'layering' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'layering' ? colors.gold : colors.subtext }]}>
            Capas
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('avatar')} style={styles.navItem}>
          <User size={20} color={activeTab === 'avatar' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'avatar' ? colors.gold : colors.subtext }]}>
            Avatar 3D
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('evaluator')} style={styles.navItem}>
          <ShoppingBag size={20} color={activeTab === 'evaluator' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'evaluator' ? colors.gold : colors.subtext }]}>
            Evaluador
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('advisor')} style={styles.navItem}>
          <Sparkles size={20} color={activeTab === 'advisor' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'advisor' ? colors.gold : colors.subtext }]}>
            Estilista
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('looks')} style={styles.navItem}>
          <Bookmark size={20} color={activeTab === 'looks' ? colors.gold : colors.subtext} />
          <Text style={[styles.navLabel, { color: activeTab === 'looks' ? colors.gold : colors.subtext }]}>
            Looks
          </Text>
        </Pressable>
      </View>

      {/* Settings & Auth Modal */}
      <SettingsModal visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 24, fontFamily: 'Plus Jakarta Sans', fontWeight: '900', letterSpacing: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 9, fontFamily: 'Inter', fontWeight: '900', color: '#111318' },
  topRightActions: { flexDirection: 'row', gap: 8 },
  themeBtn: { padding: 8, borderRadius: 12 },
  container: { flex: 1 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderTopWidth: 1 },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontFamily: 'Inter', fontWeight: '600' },
});
