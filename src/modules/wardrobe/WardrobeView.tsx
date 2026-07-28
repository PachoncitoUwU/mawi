import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Garment, GarmentCategory } from '../../types';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { HapticButton } from '../../components/ui/HapticButton';
import { BlurModal } from '../../components/ui/BlurModal';
import { Plus, Filter, Tag, DollarSign, Shirt, Sparkles, Check } from 'lucide-react-native';

interface WardrobeViewProps {
  garments: Garment[];
  onAddGarment: (newGarment: Garment) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Todo el Armario',
  headwear: 'Gorros & Gafas',
  top_inner: 'Camisetas & Manga Larga',
  top_outer: 'Sudaderas & Chaquetas',
  bottom: 'Pantalones & Shorts',
  footwear: 'Sneakers & Chanclas',
};

export const WardrobeView: React.FC<WardrobeViewProps> = ({ garments, onAddGarment }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<GarmentCategory>('top_inner');
  const [newColor, setNewColor] = useState('Negro Alabastro');
  const [newHex, setNewHex] = useState('#111318');
  const [newPrice, setNewPrice] = useState('65');

  const filteredGarments = selectedCategory === 'all'
    ? garments
    : garments.filter(g => g.category === selectedCategory);

  const handleCreateGarment = () => {
    if (!newName.trim()) return;
    const item: Garment = {
      id: `g-${Date.now()}`,
      name: newName,
      category: newCategory,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
      color: newColor,
      hexColor: newHex,
      price: parseFloat(newPrice) || 50,
      timesWorn: 0,
      tags: ['nuevo', 'custom'],
    };
    onAddGarment(item);
    setIsAddModalOpen(false);
    setNewName('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>ARMARIO DIGITAL</Text>
          <Text style={[styles.title, { color: colors.text }]}>Tus Prendas ({filteredGarments.length})</Text>
        </View>
        <HapticButton
          title="Nueva Prenda"
          variant="gold"
          icon={<Plus size={18} color="#111318" />}
          onPress={() => setIsAddModalOpen(true)}
        />
      </View>

      {/* Category Chips Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipContent}>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const isActive = selectedCategory === key;
          return (
            <Pressable
              key={key}
              onPress={() => setSelectedCategory(key)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.accent : colors.card,
                  borderColor: isActive ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? (colors.bg === '#0E0F12' ? '#111318' : '#FFFFFF') : colors.text },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Grid of Garments */}
      <View style={styles.grid}>
        {filteredGarments.map((garment, idx) => (
          <Pressable key={garment.id} onPress={() => setSelectedGarment(garment)} style={styles.gridCardWrapper}>
            <AnimatedCard index={idx} style={styles.card}>
              <Image source={{ uri: garment.imageUrl }} style={styles.image} resizeMode="cover" />
              <View style={styles.cardContent}>
                <View style={styles.colorTagRow}>
                  <View style={[styles.colorDot, { backgroundColor: garment.hexColor }]} />
                  <Text style={[styles.categoryBadge, { color: colors.subtext }]}>
                    {CATEGORY_LABELS[garment.category] || garment.category}
                  </Text>
                </View>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                  {garment.name}
                </Text>
                <View style={styles.statsRow}>
                  <Text style={[styles.statText, { color: colors.subtext }]}>Usada {garment.timesWorn}x</Text>
                  {garment.price && (
                    <Text style={[styles.priceText, { color: colors.gold }]}>${garment.price}</Text>
                  )}
                </View>
              </View>
            </AnimatedCard>
          </Pressable>
        ))}
      </View>

      {/* Detail Modal */}
      {selectedGarment && (
        <BlurModal visible={!!selectedGarment} onClose={() => setSelectedGarment(null)} title={selectedGarment.name}>
          <Image source={{ uri: selectedGarment.imageUrl }} style={styles.modalImage} resizeMode="cover" />
          <View style={styles.modalBody}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>Categoría:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{CATEGORY_LABELS[selectedGarment.category]}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>Tono exacto:</Text>
              <View style={styles.colorValueContainer}>
                <View style={[styles.colorDot, { backgroundColor: selectedGarment.hexColor }]} />
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedGarment.color}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>Usos registrados:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{selectedGarment.timesWorn} veces</Text>
            </View>
            {selectedGarment.price && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtext }]}>Costo por uso real:</Text>
                <Text style={[styles.detailValue, { color: colors.gold }]}>
                  ${(selectedGarment.price / Math.max(1, selectedGarment.timesWorn)).toFixed(2)} / uso
                </Text>
              </View>
            )}
            <View style={styles.tagList}>
              {selectedGarment.tags.map(t => (
                <View key={t} style={[styles.tagBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.tagText, { color: colors.subtext }]}>#{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </BlurModal>
      )}

      {/* Add Garment Modal */}
      <BlurModal visible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Agregar Prenda al Armario">
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Nombre de la prenda</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
            placeholder="ej. Hoodie Oversized Crema"
            placeholderTextColor={colors.subtext}
            value={newName}
            onChangeText={setNewName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Categoría de Capa</Text>
          <View style={styles.categoryPicker}>
            {(['headwear', 'top_inner', 'top_outer', 'bottom', 'footwear'] as GarmentCategory[]).map(cat => (
              <Pressable
                key={cat}
                onPress={() => setNewCategory(cat)}
                style={[
                  styles.catOption,
                  { backgroundColor: newCategory === cat ? colors.accent : colors.secondary }
                ]}
              >
                <Text style={{ color: newCategory === cat ? '#FFF' : colors.text, fontSize: 12 }}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Precio ($ USD)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
            keyboardType="numeric"
            value={newPrice}
            onChangeText={setNewPrice}
          />

          <HapticButton
            title="Guardar en Armario"
            variant="gold"
            onPress={handleCreateGarment}
            style={{ marginTop: 12 }}
          />
        </View>
      </BlurModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  subtitle: { fontSize: 12, fontFamily: 'Inter', letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 26, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  chipScroll: { marginBottom: 20 },
  chipContent: { gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontFamily: 'Inter', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridCardWrapper: { width: '47%' },
  card: { padding: 0 },
  image: { width: '100%', height: 160, borderRadius: 16 },
  cardContent: { padding: 12 },
  colorTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  categoryBadge: { fontSize: 11, fontFamily: 'Inter' },
  itemName: { fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', marginBottom: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statText: { fontSize: 12, fontFamily: 'Inter' },
  priceText: { fontSize: 13, fontFamily: 'Inter', fontWeight: '700' },
  modalImage: { width: '100%', height: 220, borderRadius: 16, marginBottom: 16 },
  modalBody: { gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, fontFamily: 'Inter' },
  detailValue: { fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  colorValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, fontFamily: 'Inter' },
  form: { gap: 12 },
  label: { fontSize: 14, fontFamily: 'Inter', fontWeight: '600' },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontSize: 14 },
  categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catOption: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 }
});
