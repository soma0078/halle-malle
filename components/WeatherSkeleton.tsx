import { StyleSheet, View } from 'react-native';

function Block({ width, height }: { width: number | string; height: number }) {
  return <View style={[styles.block, { width: width as number, height }]} />;
}

export function WeatherSkeleton() {
  return (
    <View style={styles.container}>
      <Block width={80} height={80} />
      <Block width={140} height={52} />
      <Block width={200} height={20} />
      <View style={styles.row}>
        <Block width={90} height={36} />
        <Block width={90} height={36} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16, paddingTop: 24 },
  row: { flexDirection: 'row', gap: 12 },
  block: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
});
