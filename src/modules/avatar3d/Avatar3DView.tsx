import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AvatarMeasurements, Garment } from '../../types';
import { HapticButton } from '../../components/ui/HapticButton';
import { User, Sliders, RotateCw, Sparkles, Layers } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Avatar3DViewProps {
  initialAvatar: AvatarMeasurements;
  activeOutfitGarments: Garment[];
}

export const Avatar3DView: React.FC<Avatar3DViewProps> = ({ initialAvatar, activeOutfitGarments }) => {
  const { colors } = useTheme();
  const [avatar, setAvatar] = useState<AvatarMeasurements>(initialAvatar);
  const [rotation, setRotation] = useState(0);

  const updateAvatarField = (field: keyof AvatarMeasurements, value: any) => {
    setAvatar(prev => ({ ...prev, [field]: value }));
    try {
      Haptics.selectionAsync();
    } catch (e) {}
  };

  // Convert HSL values to hex preview
  const skinToneHex = `hsl(${avatar.skinToneHue}, ${avatar.skinToneSat}%, ${avatar.skinToneLight}%)`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>PROBADOR 3D HIPERREALISTA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Tu Avatar con Medidas Reales</Text>
      </View>

      {/* 3D Viewport Simulation */}
      <View style={[styles.viewport3D, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Rotation Control Button */}
        <Pressable
          onPress={() => setRotation(r => (r + 45) % 360)}
          style={[styles.rotateBtn, { backgroundColor: colors.secondary }]}
        >
          <RotateCw size={18} color={colors.text} />
          <Text style={[styles.rotateText, { color: colors.text }]}>Rotar 360° ({rotation}°)</Text>
        </Pressable>

        {/* 3D Human Avatar Model Visual Representation */}
        <View style={styles.avatarRenderContainer}>
          {/* Head & Accessories */}
          <View style={styles.avatarHeadWrapper}>
            <View style={[styles.avatarHead, { backgroundColor: skinToneHex, transform: [{ rotateY: `${rotation}deg` }] }]} />
            {activeOutfitGarments.filter(g => g.category === 'headwear').map(g => (
              <View key={g.id} style={[styles.accessoryOverlay, { backgroundColor: g.hexColor }]}>
                <Text style={styles.overlayText}>{g.name}</Text>
              </View>
            ))}
          </View>

          {/* Shoulders & Torso */}
          <View
            style={[
              styles.avatarTorso,
              {
                width: Math.min(220, Math.max(140, avatar.shoulderWidthCm * 3.6)),
                backgroundColor: skinToneHex,
                transform: [{ rotateY: `${rotation}deg` }],
              },
            ]}
          >
            {/* Top Outer Garment */}
            {activeOutfitGarments.filter(g => g.category === 'top_outer').map(g => (
              <View key={g.id} style={[styles.garmentOverlay, styles.outerLayer, { backgroundColor: g.hexColor }]}>
                <Text style={styles.garmentOverlayText}>{g.name}</Text>
              </View>
            ))}

            {/* Top Inner Garment */}
            {activeOutfitGarments.filter(g => g.category === 'top_inner').map(g => (
              <View key={g.id} style={[styles.garmentOverlay, styles.innerLayer, { backgroundColor: g.hexColor }]}>
                <Text style={styles.garmentOverlayText}>{g.name}</Text>
              </View>
            ))}
          </View>

          {/* Legs & Bottom Garments */}
          <View
            style={[
              styles.avatarLegs,
              {
                height: Math.min(160, Math.max(90, (avatar.heightCm - 100) * 1.5)),
                backgroundColor: skinToneHex,
                transform: [{ rotateY: `${rotation}deg` }],
              },
            ]}
          >
            {activeOutfitGarments.filter(g => g.category === 'bottom').map(g => (
              <View key={g.id} style={[styles.garmentOverlay, styles.bottomLayer, { backgroundColor: g.hexColor }]}>
                <Text style={styles.garmentOverlayText}>{g.name}</Text>
              </View>
            ))}
          </View>

          {/* Feet & Shoes */}
          <View style={styles.avatarFeet}>
            {activeOutfitGarments.filter(g => g.category === 'footwear').map(g => (
              <View key={g.id} style={[styles.shoeOverlay, { backgroundColor: g.hexColor }]}>
                <Text style={styles.shoeText}>{g.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.avatarBadgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{avatar.heightCm} cm</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{avatar.weightKg} kg</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{avatar.shoulderWidthCm} cm Hombros</Text>
          </View>
        </View>
      </View>

      {/* Measurement Controls */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Personalización del Cuerpo 3D</Text>
      
      <View style={[styles.controlsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Height Slider Buttons */}
        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: colors.subtext }]}>Altura: {avatar.heightCm} cm</Text>
          <View style={styles.stepBtnGroup}>
            <Pressable onPress={() => updateAvatarField('heightCm', avatar.heightCm - 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>-1</Text>
            </Pressable>
            <Pressable onPress={() => updateAvatarField('heightCm', avatar.heightCm + 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>+1</Text>
            </Pressable>
          </View>
        </View>

        {/* Weight Slider Buttons */}
        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: colors.subtext }]}>Peso: {avatar.weightKg} kg</Text>
          <View style={styles.stepBtnGroup}>
            <Pressable onPress={() => updateAvatarField('weightKg', avatar.weightKg - 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>-1</Text>
            </Pressable>
            <Pressable onPress={() => updateAvatarField('weightKg', avatar.weightKg + 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>+1</Text>
            </Pressable>
          </View>
        </View>

        {/* Shoulder Width Slider */}
        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: colors.subtext }]}>Hombros: {avatar.shoulderWidthCm} cm</Text>
          <View style={styles.stepBtnGroup}>
            <Pressable onPress={() => updateAvatarField('shoulderWidthCm', avatar.shoulderWidthCm - 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>-1</Text>
            </Pressable>
            <Pressable onPress={() => updateAvatarField('shoulderWidthCm', avatar.shoulderWidthCm + 1)} style={[styles.stepBtn, { backgroundColor: colors.secondary }]}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>+1</Text>
            </Pressable>
          </View>
        </View>

        {/* Skin Tone Selector */}
        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: colors.subtext }]}>Tono de Piel HSL</Text>
          <View style={styles.skinTonePicker}>
            {[
              { hue: 30, sat: 40, light: 75, name: 'Claro Warm' },
              { hue: 28, sat: 42, light: 65, name: 'Tan Dorado' },
              { hue: 24, sat: 45, light: 48, name: 'Moreno' },
              { hue: 20, sat: 50, light: 25, name: 'Oscuro Warm' },
            ].map(tone => (
              <Pressable
                key={tone.name}
                onPress={() => {
                  updateAvatarField('skinToneHue', tone.hue);
                  updateAvatarField('skinToneSat', tone.sat);
                  updateAvatarField('skinToneLight', tone.light);
                }}
                style={[
                  styles.skinSwatch,
                  {
                    backgroundColor: `hsl(${tone.hue}, ${tone.sat}%, ${tone.light}%)`,
                    borderWidth: avatar.skinToneLight === tone.light ? 2 : 0,
                    borderColor: colors.gold,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 20 },
  subtitle: { fontSize: 12, fontFamily: 'Inter', letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 26, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  viewport3D: {
    height: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rotateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  rotateText: { fontSize: 12, fontFamily: 'Inter', fontWeight: '600' },
  avatarRenderContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  avatarHeadWrapper: { alignItems: 'center', marginBottom: 4 },
  avatarHead: { width: 44, height: 44, borderRadius: 22 },
  accessoryOverlay: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: -10 },
  overlayText: { fontSize: 9, color: '#FFF', fontWeight: '700' },
  avatarTorso: { height: 110, borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 6, marginVertical: 4 },
  garmentOverlay: { width: '90%', paddingVertical: 4, borderRadius: 8, marginVertical: 2, alignItems: 'center' },
  outerLayer: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  innerLayer: { opacity: 0.9 },
  garmentOverlayText: { fontSize: 10, color: '#FFF', fontWeight: '700', textAlign: 'center' },
  avatarLegs: { width: 90, borderRadius: 14, alignItems: 'center', padding: 6 },
  bottomLayer: { width: '100%', height: '90%', borderRadius: 10, justifyContent: 'center' },
  avatarFeet: { flexDirection: 'row', gap: 10, marginTop: 4 },
  shoeOverlay: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  shoeText: { fontSize: 9, color: '#FFF', fontWeight: '700' },
  avatarBadgeRow: { flexDirection: 'row', gap: 10 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontFamily: 'Inter', fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', marginBottom: 14 },
  controlsCard: { padding: 18, borderRadius: 20, borderWidth: 1, gap: 14 },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlLabel: { fontSize: 14, fontFamily: 'Inter', fontWeight: '600' },
  stepBtnGroup: { flexDirection: 'row', gap: 8 },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  skinTonePicker: { flexDirection: 'row', gap: 10 },
  skinSwatch: { width: 28, height: 28, borderRadius: 14 },
});
