import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { WEATHER_ICON, getWeatherLabel, getWindDescription } from '@/constants/weatherCondition';
import { WeatherCondition, WeatherResponse } from '@/types/weather';

interface Props {
  weather: WeatherResponse;
  condition: WeatherCondition;
  moodMessage: string;
  waterTemp: number | null;
  waterTempStation: string | null;
  locationName: string | null;
}

export function WeatherSection({ weather, condition, moodMessage, waterTemp, waterTempStation, locationName }: Props) {
  const iconName = WEATHER_ICON[condition] as any;
  const label = getWeatherLabel(weather.sky, weather.pty);

  return (
    <View style={styles.container}>
      {locationName && (
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.75)" />
          <Text style={styles.locationText}>{locationName}</Text>
        </View>
      )}
      <Ionicons name={iconName} size={80} color="rgba(255,255,255,0.9)" />

      <View style={styles.tempRow}>
        <Text style={styles.temp}>{Math.round(weather.temp)}°</Text>
        <Text style={styles.tempLabel}>{label}</Text>
      </View>

      <Text style={styles.mood}>{moodMessage}</Text>

      <View style={styles.statsRow}>
        <StatItem icon="thermometer" label="체감" value={`${Math.round(weather.feelsLike)}°`} />
        <StatItem icon="water" label="습도" value={`${weather.humidity}%`} />
        <StatItem icon="speedometer" label="풍속" value={`${weather.windSpeed}m/s`} subValue={getWindDescription(weather.windSpeed)} />
        {waterTemp !== null && (
          <StatItem icon="fish" label="수온" value={`${waterTemp}°`} subValue={waterTempStation ?? undefined} />
        )}
      </View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  value,
  subValue,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon as any} size={16} color="rgba(255,255,255,0.7)" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 24, gap: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  tempRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  temp: { fontSize: 64, fontWeight: '200', color: '#fff', lineHeight: 72 },
  tempLabel: { fontSize: 20, color: 'rgba(255,255,255,0.8)', paddingBottom: 12 },
  mood: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  stat: { alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  statValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  statSubValue: { fontSize: 10, color: 'rgba(255,255,255,0.55)' },
});
