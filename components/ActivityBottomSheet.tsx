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

import { Activity } from "@/types/activity";

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
}

export function ActivityBottomSheet({ activity, onClose }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["50%", "70%"];

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

              {activity.place && (
                <View style={styles.placeRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <View style={styles.placeText}>
                    <Text style={styles.placeName}>{activity.place.name}</Text>
                    <Text style={styles.placeAddress}>
                      {activity.place.address}
                    </Text>
                  </View>
                </View>
              )}

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
  placeName: { fontSize: 14, fontWeight: "600", color: "#333" },
  placeAddress: { fontSize: 12, color: "#888" },
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
