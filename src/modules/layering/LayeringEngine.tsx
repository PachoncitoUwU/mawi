import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Garment, Outfit } from '../../types';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { HapticButton } from '../../components/ui/HapticButton';
import { ArrowUp, ArrowDown, Layers, Sparkles, Shirt, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface LayeringEngineProps {
  wardrobe: Garment[];
  onSaveOutfit: (outfit: Outfit) => void;
}

export const LayeringEngine: React.FC<LayeringEngineProps> = ({ wardrobe, onSaveOutfit }) => {
  const { colors } = useTheme();
  const [selectedGarments, setSelectedGarments] = useState<Garment[]>([
    wardrobe.find(g => g.category === 'headwear') || wardrobe[0],
    wardrobe.find(g => g.category === 'top_outer') || wardrobe[4],
    wardrobe.find(g => g.category === 'top_inner') || wardrobe[2],
    wardrobe.find(g => g.category === 'bottom') || wardrobe[6],
    wardrobe.find(g => g.category === 'footwear') || wardrobe[8],
  ].filter(Boolean) as Garment[]);

  const [outfitName, setOutfitName] = useState('Combo Layering Editorial');

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    const newItems = [...selectedGarments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setSelectedGarments(newItems);
  };

  const toggleGarmentInLayer = (item: Garment) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}

    if (selectedGarments.some(g => g.id === item.id)) {
      setSelectedGarments(prev => prev.filter(g => g.id !== item.id));
    } else {
      setSelectedGarments(prev => [item, ...prev]);
    }
  };

  const handleSave = () => {
    const newOutfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name: outfitName,
      garments: selectedGarments,
      tags: ['layering', 'custom'],
      occasion: 'Casual / Editorial',
      isFavorite: true,
      createdAt: new Date().toISOString(),
      styleMode: 'clasico',
      aiExplanation: 'Equilibrio de capas superpuestas con ajuste cromático refinado.'
    };
    onSaveOutfit(newOutfit);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>MOTOR DE CAPAS (LAYERING)</Text>
        <Text style={[styles.title, { color: colors.text }]}>Orden de Apilamiento (Z-Index)</Text>
      </View>

      {/* Layer Visual Stack */}
      <View style={[styles.canvas, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.canvasTitle, { color: colors.subtext }]}>VISUALIZACIÓN DE CAPAS SUPERPUESTAS (DE EXTERIOR A BASE)</Text>
        
        <View style={styles.layerStack}>
          {selectedGarments.map((item, idx) => {
            const zIndexLevel = selectedGarments.length - idx;
            return (
              <AnimatedCard key={`${item.id}-${idx}`} index={idx} style={StyleSheet.flatten([styles.layerCard, { zIndex: zIndexLevel }])}>
                <View style={styles.layerLeft}>
                  <View style={[styles.zIndexBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.zIndexText, { color: colors.text }]}>Cap {zIndexLevel}</Text>
                  </View>
                  <Image source={{ uri: item.imageUrl }} style={styles.layerImage} />
                  <View>
                    <Text style={[styles.layerName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.layerCategory, { color: colors.subtext }]}>{item.category.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Layer Control Arrows */}
                <View style={styles.layerControls}>
                  <Pressable
                    disabled={idx === 0}
                    onPress={() => moveLayer(idx, 'up')}
                    style={[styles.arrowBtn, { opacity: idx === 0 ? 0.3 : 1 }]}
                  >
                    <ArrowUp size={18} color={colors.text} />
                  </Pressable>
                  <Pressable
                    disabled={idx === selectedGarments.length - 1}
                    onPress={() => moveLayer(idx, 'down')}
                    style={[styles.arrowBtn, { opacity: idx === selectedGarments.length - 1 ? 0.3 : 1 }]}
                  >
                    <ArrowDown size={18} color={colors.text} />
                  </Pressable>
                </View>
              </AnimatedCard>
            );
          })}
        </View>

        <HapticButton
          title="Guardar Outfit de Capas"
          variant="gold"
          icon={<Check size={18} color="#111318" />}
          onPress={handleSave}
          style={{ marginTop: 20 }}
        />
      </View>

      {/* Wardrobe Quick Selector for Layering */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Agregar / Quitar Prendas al Estante de Capas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.garmentPickerContent}>
        {wardrobe.map(item => {
          const isSelected = selectedGarments.some(g => g.id === item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => toggleGarmentInLayer(item)}
              style={[
                styles.garmentChip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.card,
                  borderColor: isSelected ? colors.gold : colors.border,
                },
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.chipImage} />
              <Text
                style={[
                  styles.chipName,
                  { color: isSelected ? (colors.bg === '#0E0F12' ? '#111318' : '#FFF') : colors.text },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 20 },
  subtitle: { fontSize: 12, fontFamily: 'Inter', letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 26, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  canvas: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 24 },
  canvasTitle: { fontSize: 11, fontFamily: 'Inter', letterSpacing: 1, fontWeight: '700', marginBottom: 16 },
  layerStack: { gap: 12 },
  layerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  layerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  zIndexBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  zIndexText: { fontSize: 11, fontFamily: 'Inter', fontWeight: '700' },
  layerImage: { width: 44, height: 44, borderRadius: 10 },
  layerName: { fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  layerCategory: { fontSize: 11, fontFamily: 'Inter' },
  layerControls: { flexDirection: 'row', gap: 4 },
  arrowBtn: { padding: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)' },
  sectionTitle: { fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', marginBottom: 14 },
  garmentPickerContent: { gap: 12 },
  garmentChip: { width: 120, padding: 10, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  chipImage: { width: 60, height: 60, borderRadius: 12, marginBottom: 8 },
  chipName: { fontSize: 12, fontFamily: 'Inter', textAlign: 'center' },
});
