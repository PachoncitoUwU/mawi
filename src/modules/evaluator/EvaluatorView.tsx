import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Garment, PurchaseEvaluation } from '../../types';
import { evaluatePurchaseWithAI } from '../../services/gemini';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { HapticButton } from '../../components/ui/HapticButton';
import { ShoppingBag, Sparkles, CheckCircle2, AlertTriangle, XCircle, DollarSign, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface EvaluatorViewProps {
  wardrobe: Garment[];
}

export const EvaluatorView: React.FC<EvaluatorViewProps> = ({ wardrobe }) => {
  const { colors } = useTheme();
  const [itemTitle, setItemTitle] = useState('Chaqueta Cuero Minimal Vintage');
  const [itemPrice, setItemPrice] = useState('120');
  const [itemColor, setItemColor] = useState('Negro Azabache');
  const [itemCategory, setItemCategory] = useState('top_outer');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<PurchaseEvaluation | null>(null);

  const handleEvaluate = async () => {
    if (!itemTitle.trim()) return;
    setIsLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}

    const result = await evaluatePurchaseWithAI(
      itemTitle,
      parseFloat(itemPrice) || 100,
      itemColor,
      itemCategory,
      wardrobe
    );

    setEvaluation(result);
    setIsLoading(false);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
  };

  const getVerdictIcon = (verdict: string) => {
    if (verdict === 'Comprar con confianza') return <CheckCircle2 size={24} color="#10B981" />;
    if (verdict === 'Pensárselo dos veces') return <AlertTriangle size={24} color="#F59E0B" />;
    return <XCircle size={24} color="#EF4444" />;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>EVALUADOR DE COMPRAS IA</Text>
        <Text style={[styles.title, { color: colors.text }]}>¿Me conviene comprar esto?</Text>
      </View>

      {/* Input Form Card */}
      <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>Ingresa los datos de la prenda que deseas comprar</Text>

        <Text style={[styles.label, { color: colors.subtext }]}>Nombre o Enlace de la Prenda</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
          placeholder="ej. Chaqueta Cuero Minimalist"
          placeholderTextColor={colors.subtext}
          value={itemTitle}
          onChangeText={setItemTitle}
        />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.subtext }]}>Precio ($ USD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
              keyboardType="numeric"
              value={itemPrice}
              onChangeText={setItemPrice}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.subtext }]}>Color Dominante</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
              value={itemColor}
              onChangeText={setItemColor}
            />
          </View>
        </View>

        <HapticButton
          title={isLoading ? 'Analizando Armario...' : 'Evaluar Compra con IA'}
          variant="gold"
          icon={isLoading ? <ActivityIndicator color="#111318" /> : <Sparkles size={18} color="#111318" />}
          onPress={handleEvaluate}
          disabled={isLoading}
          style={{ marginTop: 12 }}
        />
      </View>

      {/* Result Card */}
      {evaluation && (
        <AnimatedCard index={1} style={styles.resultCard}>
          <View style={styles.verdictHeader}>
            {getVerdictIcon(evaluation.verdict)}
            <Text style={[styles.verdictText, { color: colors.text }]}>{evaluation.verdict}</Text>
          </View>

          {/* Versatility Bar */}
          <View style={styles.scoreRow}>
            <View>
              <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Índice de Versatilidad</Text>
              <Text style={[styles.scoreValue, { color: colors.gold }]}>{evaluation.versatilityScore}%</Text>
            </View>
            <View>
              <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Costo por Puesta Est.</Text>
              <Text style={[styles.scoreValue, { color: colors.text }]}>${evaluation.costPerWear} / uso</Text>
            </View>
            <View>
              <Text style={[styles.scoreLabel, { color: colors.subtext }]}>Combos Posibles</Text>
              <Text style={[styles.scoreValue, { color: colors.text }]}>{evaluation.matchingOutfitsCount} outfits</Text>
            </View>
          </View>

          {/* Color Harmony Advice */}
          <View style={[styles.adviceBox, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.adviceTitle, { color: colors.text }]}>💡 Armonía Cromática y Silueta</Text>
            <Text style={[styles.adviceText, { color: colors.subtext }]}>{evaluation.colorHarmonyAdvice}</Text>
          </View>

          {/* Pros & Cons */}
          <View style={styles.prosConsRow}>
            <View style={styles.proBox}>
              <Text style={styles.proTitle}>Ventajas</Text>
              {evaluation.pros.map((p, i) => (
                <Text key={i} style={[styles.bulletText, { color: colors.subtext }]}>✓ {p}</Text>
              ))}
            </View>
            <View style={styles.conBox}>
              <Text style={styles.conTitle}>A Considerar</Text>
              {evaluation.cons.map((c, i) => (
                <Text key={i} style={[styles.bulletText, { color: colors.subtext }]}>• {c}</Text>
              ))}
            </View>
          </View>
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
  formCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 12, marginBottom: 24 },
  formTitle: { fontSize: 15, fontFamily: 'Plus Jakarta Sans', fontWeight: '700', marginBottom: 4 },
  label: { fontSize: 12, fontFamily: 'Inter', fontWeight: '600' },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontSize: 14 },
  rowInputs: { flexDirection: 'row', gap: 12 },
  resultCard: { gap: 16 },
  verdictHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  verdictText: { fontSize: 20, fontFamily: 'Plus Jakarta Sans', fontWeight: '800' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  scoreLabel: { fontSize: 11, fontFamily: 'Inter' },
  scoreValue: { fontSize: 18, fontFamily: 'Plus Jakarta Sans', fontWeight: '800', marginTop: 2 },
  adviceBox: { padding: 14, borderRadius: 14, gap: 6 },
  adviceTitle: { fontSize: 13, fontFamily: 'Plus Jakarta Sans', fontWeight: '700' },
  adviceText: { fontSize: 13, fontFamily: 'Inter', lineHeight: 18 },
  prosConsRow: { flexDirection: 'row', gap: 16 },
  proBox: { flex: 1, gap: 4 },
  conBox: { flex: 1, gap: 4 },
  proTitle: { fontSize: 13, fontFamily: 'Inter', fontWeight: '700', color: '#10B981' },
  conTitle: { fontSize: 13, fontFamily: 'Inter', fontWeight: '700', color: '#F59E0B' },
  bulletText: { fontSize: 12, fontFamily: 'Inter' },
});
