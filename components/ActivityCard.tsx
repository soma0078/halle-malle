import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

import { Activity } from '@/types/activity';

interface Props {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

export function ActivityCard({ activity, onPress }: Props) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withTiming(0.95, { duration: 80 });
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)(activity);
    })
    .onFinalize(() => {
      scale.value = withTiming(1, { duration: 150 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.emoji}>{activity.emoji}</Text>
        <Text style={styles.name}>{activity.name}</Text>
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Text key={i} style={i < activity.suitability ? styles.starOn : styles.starOff}>
              ★
            </Text>
          ))}
        </View>
        <Text style={styles.duration}>{activity.duration}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  emoji: { fontSize: 40 },
  name: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', textAlign: 'center' },
  stars: { flexDirection: 'row' },
  starOn: { color: '#FFB800', fontSize: 12 },
  starOff: { color: '#ddd', fontSize: 12 },
  duration: { fontSize: 11, color: '#888' },
});
