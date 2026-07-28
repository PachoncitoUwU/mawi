import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Outfit } from '../../types';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { Bookmark, Search, Tag, Sparkles } from 'lucide-react-native';

interface SavedLooksViewProps {
  savedOutfits: Outfit[];
}

export const SavedLooksView: React.FC<SavedLooksViewProps> = ({ savedOutfits }) => {
  const { colors } = useTheme();
  const [searchTag, setSearchTag] = useState('');

  const filteredOutfits = searchTag.trim()
    ? savedOutfits.filter(o => o.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase())) || o.name.toLowerCase().includes(searchTag.toLowerCase()))
    : savedOutfits;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>GALERÍA DE LOOKS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Tus Outfits Guardados ({filteredOutfits.length})</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={18} color={colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar por etiqueta (#casual, #cita, #trabajo)..."
          placeholderTextColor={colors.subtext}
          value={searchTag}
          onChangeText={setSearchTag}
        />
      </View>

      {/* Outfits List */}
      <View style={styles.grid}>
        {filteredOutfits.map((outfit, idx) => (
          <AnimatedCard key={outfit.id} index={idx} style={styles.outfitCard}>
            <View style={styles.cardHeader}>
              <Text style={[styles.outfitTitle, { color: colors.text }]}>{outfit.name}</Text>
              <Bookmark size={18} color={colors.gold} fill={colors.gold} />
            </View>

            {outfit.aiExplanation && (
              <Text style={[styles.aiText, { color: colors.subtext }]} numberOfLines={2}>
                {outfit.aiExplanation}
              </Text>
            )}

            {/* Garments Thumbnails */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.garmentsRow}>
              {outfit.garments.map(g => (
                <Image key={g.id} source={{ uri: g.imageUrl }} style={styles.thumb} />
              ))}
            </ScrollView>

            {/* Tags */}
            <View style={styles.tagRow}>
              {outfit.tags.map(t => (
                <View key={t} style={[styles.tagBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.tagText, { color: colors.subtext }]}>#{t}</Text>
                </View>
              ))}
            </View>
          </AnimatedCard>
        ))}
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
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter' },
  grid: { gap: 16 },
  outfitCard: { gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  outfitTitle: { fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '800' },
  aiText: { fontSize: 12, fontFamily: 'Inter', fontStyle: 'italic' },
  garmentsRow: { gap: 8, marginVertical: 4 },
  thumb: { width: 64, height: 64, borderRadius: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontFamily: 'Inter' },
});
