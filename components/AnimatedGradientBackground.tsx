import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { WeatherCondition } from '@/types/weather';

const CONDITION_INDEX: Record<WeatherCondition, number> = {
  hot_sunny: 0,
  warm_sunny: 1,
  cool_sunny: 2,
  cloudy: 3,
  rainy: 4,
};
const COLORS = ['#FF6B35', '#2196F3', '#1565C0', '#546E7A', '#263238'];
const INPUT_RANGE = [0, 1, 2, 3, 4];

interface Props {
  condition: WeatherCondition;
  children?: React.ReactNode;
  style?: object;
}

export function AnimatedGradientBackground({ condition, children, style }: Props) {
  // 조건 변경 시 0~4 사이 숫자로 트래킹
  const progress = useSharedValue(CONDITION_INDEX[condition]);

  useEffect(() => {
    // 날씨 조건이 바뀌면 0.8초 동안 부드럽게 색상 전환
    progress.value = withTiming(CONDITION_INDEX[condition], { duration: 800 });
  }, [condition]);

  const animatedStyle = useAnimatedStyle(() => ({
    // interpolateColor: progress 값에 따라 COLORS 배열에서 색상을 보간
    backgroundColor: interpolateColor(progress.value, INPUT_RANGE, COLORS),
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
