import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springPresets } from '../../theme/colors';

interface HapticButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springPresets.snappy);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics fallback for web
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springPresets.bouncy);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return { bg: '#D4AF37', text: '#111318' };
      case 'secondary':
        return { bg: '#1F222B', text: '#F4F5F8' };
      case 'outline':
        return { bg: 'transparent', text: '#F4F5F8', border: '#262933' };
      default:
        return { bg: '#111318', text: '#FFFFFF' };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor: vStyle.bg, borderColor: vStyle.border || 'transparent', borderWidth: vStyle.border ? 1 : 0 },
          disabled && styles.disabled,
        ]}
      >
        {icon}
        <Text style={[styles.text, { color: vStyle.text }, textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
