import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Garment, Outfit } from '../../types';
import { generateOutfitRecommendation } from '../../services/gemini';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { HapticButton } from '../../components/ui/HapticButton';
import { Sparkles, Zap, ShieldCheck, Shirt, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface AdvisorViewProps {
  wardrobe: Garment[];
  onSaveOutfit: (outfit: Outfit) => void;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({ wardrobe, onSaveOutfit }) => {
  const { colors } = useTheme();
  const [styleMode, setStyleMode] = useState<'clasico' | 'atrevido'>('atrevido');
  const [occasion, setOccasion] = useState('Cita Nocturna / Streetwear Urban');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedOutfit, setRecommendedOutfit] = useState<{
    name: string;
    garments: Garment[];
    aiExplanation: string;
  } | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    const result = await generateOutfitRecommendation(wardrobe, styleMode, occasion);
    
    // Resolve IDs to actual Garment objects
    const resolvedGarments = wardrobe.filter(g => result.garmentIds.includes(g.id));
    const fallbackGarments = resolvedGarments.length > 0 ? resolvedGarments : wardrobe.slice(0, 4);

    setRecommendedOutfit({
      name: result.name,
      garments: fallbackGarments,
      aiExplanation: result.aiExplanation,
    });

    setIsLoading(false);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>ESTILISTA MAWI IA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Generador de Outfit Personal</Text>
      </View>

      {/* Style Mode Selector */}
      <View style={[styles.modeSelectorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.modeTitle, { color: colors.text }]}>Elige la Filosofía del Look</Text>
        <View style={styles.modeButtons}>
          <Pressable
            onPress={() => setStyleMode('atrevido')}
            style={[
              styles.modeBtn,
              {
                backgroundColor: styleMode === 'atrevido' ? colors.gold : colors.secondary,
              },
            ]}
          >
            <Zap size={18} color={styleMode === 'atrevido' ? '#111318' : colors.text} />
            <Text
              style={[
                styles.modeBtnText,
                { color: styleMode === 'atrevido' ? '#111318' : colors.text },
              ]}
            >
              Atrevido ("Raras & Buenas")
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setStyleMode('clasico')}
            style={[
              styles.modeBtn,
              {
                backgroundColor: styleMode === 'clasico' ? colors.accent : colors.secondary,
              },
            ]}
          >
            <ShieldCheck size={18} color={styleMode === 'clasico' ? '#FFF' : colors.text} />
            <Text
              style={[
                styles.modeBtnText,
                { color: styleMode === 'clasico' ? '#FFF' : colors.text },
              ]}
            >
              Clásico Elegante
            </Text>
          </Pressable>
        </View>

        {/* Occasion Quick Chips */}
        <Text style={[styles.label, { color: colors.subtext, marginTop: 12 }]}>Ocasión / Evento</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[
            'Cita Nocturna',
            'Streetwear Urbano',
            'Oficina / Trabajo',
            'Casual Fin de Semana',
            'Evento Formal',
          ].map(occ => (
            <Pressable
              key={occ}
              onPress={() => setOccasion(occ)}
              style={[
                styles.occChip,
                {
                  backgroundColor: occasion === occ ? colors.accent : colors.secondary,
                },
              ]}
            >
              <Text style={{ color: occasion === occ ? '#FFF' : colors.text, fontSize: 12 }}>{occ}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <HapticButton
          title={isLoading ? 'Diseñando Combinación...' : 'Generar Outfit con IA'}
          variant="gold"
          icon={isLoading ? <ActivityIndicator color="#111318" /> : <Sparkles size={18} color="#111318" />}
          onPress={handleGenerate}
          disabled={isLoading}
          style={{ marginTop: 16 }}
        />
      </View>

      {/* Outfit Output */}
      {recommendedOutfit && (
        <AnimatedCard index={1} style={styles.outfitCard}>
          <Text style={[styles.outfitName, { color: colors.text }]}>{recommendedOutfit.name}</Text>
          
          <View style={[styles.explanationBox, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.explanationTitle, { color: colors.gold }]}>✨ Teoría de Color y Silueta</Text>
            <Text style={[styles.explanationText, { color: colors.text }]}>{recommendedOutfit.aiExplanation}</Text>
          </View>

          <Text style={[styles.label, { color: colors.subtext, marginTop: 8 }]}>Prendas Seleccionadas:</Text>
          <View style={styles.garmentRow}>
            {recommendedOutfit.garments.map(g => (
              <View key={g.id} style={styles.garmentItem}>
                <Image source={{ uri: g.imageUrl }} style={styles.garmentThumb} />
                <Text style={[styles.garmentTitle, { color: colors.text }]} numberOfLines={1}>
                  {g.name}
                </Text>
              </View>
            ))}
          </View>

          <HapticButton
            title="Guardar Look en Galería"
            variant="secondary"
            icon={<Check size={18} color="#FFF" />}
            onPress={() => {
              onSaveOutfit({
                id: `outfit-${Date.now()}`,
                name: recommendedOutfit.name,
                garments: recommendedOutfit.garments,
                tags: [styleMode, 'ia'],
                occasion,
                isFavorite: true,
                createdAt: new Date().toISOString(),
                aiExplanation: recommendedOutfit.aiExplanation,
                styleMode,
              });
            }}
            style={{ marginTop: 14 }}
          />
        </AnimatedCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 20 },
  subtitle: { fontSize: 12, fontFamily: 'Inter', letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 26, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  modeSelectorCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 12, marginBottom: 24 },
  modeTitle: { fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  modeButtons: { flexDirection: 'row', gap: 10 },
  modeBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  modeBtnText: { fontSize: 12, fontFamily: 'Inter', fontWeight: '700' },
  label: { fontSize: 12, fontFamily: 'Inter', fontWeight: '600' },
  chipRow: { gap: 8 },
  occChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  outfitCard: { gap: 14 },
  outfitName: { fontSize: 22, fontFamily: 'Plus Jakarta Sans', fontWeight: '800' },
  explanationBox: { padding: 14, borderRadius: 14, gap: 6 },
  explanationTitle: { fontSize: 13, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  explanationText: { fontSize: 13, fontFamily: 'Inter', lineHeight: 18 },
  garmentRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  garmentItem: { width: 80, alignItems: 'center' },
  garmentThumb: { width: 70, height: 70, borderRadius: 12, marginBottom: 4 },
  garmentTitle: { fontSize: 11, fontFamily: 'Inter', textAlign: 'center' },
});
