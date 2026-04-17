import { StyleSheet, View } from "react-native";

function CardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={[styles.block, { width: 48, height: 48, borderRadius: 24 }]} />
      <View style={[styles.block, { width: 90, height: 14 }]} />
      <View style={[styles.block, { width: 60, height: 12 }]} />
      <View style={[styles.block, { width: 50, height: 11 }]} />
    </View>
  );
}

export function ActivitySkeleton() {
  return (
    <View style={styles.row}>
      {Array.from({ length: 3 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  block: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 8,
  },
});
