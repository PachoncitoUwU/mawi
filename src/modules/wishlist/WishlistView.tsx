import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Garment } from '../../types';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { HapticButton } from '../../components/ui/HapticButton';
import { Heart, Plus, TrendingUp, DollarSign } from 'lucide-react-native';

interface WishlistViewProps {
  wardrobe: Garment[];
}

export const WishlistView: React.FC<WishlistViewProps> = ({ wardrobe }) => {
  const { colors } = useTheme();
  const [wishlistItems, setWishlistItems] = useState<Garment[]>([
    {
      id: 'w-1',
      name: 'Buzo Tejido Lana Merino Off-White',
      category: 'top_outer',
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format&fit=crop',
      color: 'Crema / Alabastro',
      hexColor: '#F5F5F7',
      price: 130,
      timesWorn: 0,
      tags: ['deseo', 'invierno'],
      priority: 'alta',
    },
    {
      id: 'w-2',
      name: 'Botas Cuero Chelsea Mawi Noir',
      category: 'footwear',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop',
      color: 'Negro Obsidiana',
      hexColor: '#16181E',
      price: 195,
      timesWorn: 0,
      tags: ['editorial', 'formal'],
      priority: 'media',
    },
  ]);

  const totalBudgetNeeded = wishlistItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>COMPRAS FUTURAS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Tu Wishlist Inteligente</Text>
      </View>

      {/* Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Presupuesto Total Estimado</Text>
          <Text style={[styles.summaryPrice, { color: colors.gold }]}>${totalBudgetNeeded} USD</Text>
        </View>
        <View style={styles.impactBadge}>
          <TrendingUp size={16} color="#10B981" />
          <Text style={styles.impactText}>+24% Versatilidad Armario</Text>
        </View>
      </View>

      {/* Wishlist Items List */}
      <View style={styles.list}>
        {wishlistItems.map((item, idx) => (
          <AnimatedCard key={item.id} index={idx} style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <View style={styles.priorityRow}>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        item.priority === 'alta' ? '#EF4444' : item.priority === 'media' ? '#F59E0B' : '#10B981',
                    },
                  ]}
                >
                  <Text style={styles.priorityText}>Prioridad {item.priority?.toUpperCase()}</Text>
                </View>
                <Heart size={18} color={colors.gold} fill={colors.gold} />
              </View>

              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.gold }]}>${item.price} USD</Text>
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
  summaryCard: { padding: 20, borderRadius: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  summaryLabel: { fontSize: 12, fontFamily: 'Inter' },
  summaryPrice: { fontSize: 24, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  impactBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  impactText: { fontSize: 12, fontFamily: 'Inter', color: '#10B981', fontWeight: '700' },
  list: { gap: 16 },
  card: { flexDirection: 'row', gap: 16, padding: 12 },
  itemImage: { width: 90, height: 90, borderRadius: 14 },
  itemDetails: { flex: 1, justifyContent: 'center', gap: 4 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 9, color: '#FFF', fontWeight: '700' },
  itemName: { fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  itemPrice: { fontSize: 16, fontFamily: 'Inter', fontWeight: '800' },
});
