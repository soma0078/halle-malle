import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { LOCATION_STATUS } from "@/constants/status";
import { ACTIVITY_KEYWORDS } from "@/constants/activityKeywords";
import { useGetNearbyPlaces } from "@/hooks/useGetNearbyPlace";
import { Activity, ActivityPlace } from "@/types/activity";
import { Coords } from "@/types/coords";

// 체크리스트 개별 항목 — 마운트 시 순차 fade+slide 애니메이션
function CheckItem({ item, index }: { item: string; index: number }) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(14);

  useEffect(() => {
    // index * 80ms 딜레이로 순차 등장
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 250 }));
    ty.value = withDelay(
      index * 80,
      withSpring(0, { damping: 15, stiffness: 200 }),
    );
  }, [index]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Animated.View style={[styles.checkItem, animStyle]}>
      <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
      <Text style={styles.checkText}>{item}</Text>
    </Animated.View>
  );
}

interface Props {
  activity: Activity | null;
  onClose: () => void;
  coords: Coords | null;
  locationStatus: string;
}

export function ActivityBottomSheet({
  activity,
  onClose,
  coords,
  locationStatus,
}: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["50%", "70%"];

  const keyword = activity ? (ACTIVITY_KEYWORDS[activity.id] ?? "") : "";
  const isGranted = locationStatus === LOCATION_STATUS.GRANTED;
  const canFetch = isGranted && !!activity && !!coords && keyword !== "";

  const { data: nearbyPlaces, isLoading: nearbyLoading } = useGetNearbyPlaces({
    query: keyword,
    coords: coords ?? { lat: 0, lon: 0 },
    enabled: canFetch,
  });

  useEffect(() => {
    if (activity) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [activity]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  // 표시할 장소 결정
  let displayPlace: ActivityPlace | null = null;
  if (activity) {
    if (isGranted && canFetch) {
      if (!nearbyLoading && nearbyPlaces && nearbyPlaces.length > 0) {
        const p = nearbyPlaces[0];
        displayPlace = {
          name: p.place_name,
          address: p.road_address_name || p.address_name,
          distance: p.distance ? parseInt(p.distance, 10) : undefined,
          source: "nearby",
        };
      } else if (!nearbyLoading) {
        // API 실패 or 결과 없음 → 정적 폴백
        displayPlace = activity.place ?? null;
      }
      // nearbyLoading 중엔 null → 스켈레톤 표시
    } else {
      displayPlace = activity.place ?? null;
    }
  }

  const showPlaceSkeleton = isGranted && canFetch && nearbyLoading;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      enableDismissOnClose
      enablePanDownToClose
    >
      <BottomSheetView style={styles.container}>
        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {activity && (
            <>
              <View style={styles.header}>
                <Text style={styles.emoji}>{activity.emoji}</Text>
                <View style={styles.headerText}>
                  <Text style={styles.name}>{activity.name}</Text>
                  <View style={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Text
                        key={i}
                        style={
                          i < activity.suitability
                            ? styles.starOn
                            : styles.starOff
                        }
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.durationRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.durationText}>
                  소요시간 {activity.duration}
                </Text>
              </View>

              {showPlaceSkeleton ? (
                <View style={styles.placeRow}>
                  <View style={styles.skeletonIcon} />
                  <View style={styles.placeText}>
                    <View style={styles.skeletonName} />
                    <View style={styles.skeletonAddress} />
                  </View>
                </View>
              ) : displayPlace ? (
                <View style={styles.placeRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <View style={styles.placeText}>
                    <View style={styles.placeNameRow}>
                      <Text style={styles.placeName}>{displayPlace.name}</Text>
                      {displayPlace.source === "nearby" &&
                        displayPlace.distance !== undefined && (
                          <Text style={styles.distanceBadge}>
                            {displayPlace.distance < 1000
                              ? `${displayPlace.distance}m`
                              : `${(displayPlace.distance / 1000).toFixed(1)}km`}
                          </Text>
                        )}
                    </View>
                    <Text style={styles.placeAddress}>
                      {displayPlace.address}
                    </Text>
                  </View>
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>준비물 체크리스트</Text>
              {activity.checklist.map((item, i) => (
                <CheckItem key={`${activity.id}-${i}`} item={item} index={i} />
              ))}
            </>
          )}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#fff",
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  emoji: { fontSize: 48 },
  headerText: { flex: 1 },
  name: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  stars: { flexDirection: "row", marginTop: 4 },
  starOn: { color: "#FFB800", fontSize: 16 },
  starOff: { color: "#ddd", fontSize: 16 },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  durationText: { fontSize: 14, color: "#555" },
  placeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  placeText: { flex: 1, gap: 2 },
  placeNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  placeName: { fontSize: 14, fontWeight: "600", color: "#333" },
  distanceBadge: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  placeAddress: { fontSize: 12, color: "#888" },
  skeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginTop: 2,
  },
  skeletonName: {
    height: 14,
    width: "60%",
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginBottom: 6,
  },
  skeletonAddress: {
    height: 12,
    width: "80%",
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  checkText: { fontSize: 15, color: "#333" },
});
