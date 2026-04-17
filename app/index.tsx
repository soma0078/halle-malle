import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { LOCATION_STATUS } from "@/constants/status";
import { ActivityBottomSheet } from "@/components/ActivityBottomSheet";
import { ActivityCard } from "@/components/ActivityCard";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { WeatherSection } from "@/components/WeatherSection";
import { ActivitySkeleton } from "@/components/ActivitySkeleton";
import { WeatherSkeleton } from "@/components/WeatherSkeleton";
import { getActivitiesByCondition } from "@/constants/activities";
import {
  getMoodMessage,
  getWeatherCondition,
  getWeatherErrorMessage,
} from "@/constants/weatherCondition";
import { useGetHangangTemp } from "@/hooks/useGetHangangTemp";
import { useLocation } from "@/hooks/useLocation";
import { useGetWeather } from "@/hooks/useGetWeather";
import { Activity } from "@/types/activity";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { coords, locationName, status: locationStatus } = useLocation();
  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    error,
    refetch,
  } = useGetWeather({ lat: coords?.latitude, lon: coords?.longitude });
  const { data: waterTemp } = useGetHangangTemp({
    lat: coords?.latitude,
    lon: coords?.longitude,
  });

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const condition = weather ? getWeatherCondition(weather) : "warm_sunny";
  const moodMessage = weather ? getMoodMessage(condition) : "";
  const activities = getActivitiesByCondition(condition);
  const isLoading =
    locationStatus === LOCATION_STATUS.PENDING || weatherLoading;

  // 에러 shake 애니메이션
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  useEffect(() => {
    if (weatherError) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    }
  }, [weatherError]);

  const errorMessage = error ? getWeatherErrorMessage(error) : "";

  return (
    <View style={styles.root}>
      {/* 날씨 조건에 따라 배경색 전환 */}
      <AnimatedGradientBackground condition={condition} />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 날씨 섹션  */}
          <View style={styles.weatherCard}>
            {isLoading ? (
              <WeatherSkeleton />
            ) : locationStatus === LOCATION_STATUS.ERROR || weatherError ? (
              <Animated.View style={[styles.errorContainer, shakeStyle]}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                  <Text style={styles.retryText}>다시 시도</Text>
                </Pressable>
              </Animated.View>
            ) : (
              <>
                {locationStatus === LOCATION_STATUS.DENIED && (
                  <Text style={styles.permissionBanner}>
                    위치 권한이 없어 서울 기준으로 표시됩니다
                  </Text>
                )}
                {weather ? (
                  <WeatherSection
                    weather={weather}
                    condition={condition}
                    moodMessage={moodMessage}
                    waterTemp={waterTemp?.temp ?? null}
                    waterTempStation={waterTemp?.stationName ?? null}
                    locationName={locationName}
                  />
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 활동 추천 섹션 */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>오늘 이런 활동 어때요?</Text>
        {isLoading ? (
          <ActivitySkeleton />
        ) : (
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ActivityCard activity={item} onPress={setSelectedActivity} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activityList}
          />
        )}
      </View>

      <ActivityBottomSheet
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, flexDirection: "column" },
  scroll: { flex: 1 },
  content: { paddingTop: 20 },
  weatherCard: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    minHeight: 320,
    justifyContent: "center",
  },
  permissionBanner: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: -8,
  },
  errorContainer: { alignItems: "center", gap: 12, paddingTop: 40 },
  errorText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  retryText: { color: "#fff", fontWeight: "600" },
  activitySection: {
    backgroundColor: "#F7F8FA",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activityList: { paddingHorizontal: 20, paddingBottom: 20 },
});
