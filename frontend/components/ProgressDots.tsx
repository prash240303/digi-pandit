// src/components/ProgressDots.tsx
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} active={i + 1 <= current} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(active ? 24 : 8),
    backgroundColor: active ? '#7C3AED' : '#2a2a2a',
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginBottom: 40 },
  dot: { height: 6, borderRadius: 3 },
});