import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../../features/bookings/hooks/useBookings';
import { C } from '../../lib/design';
import type { Booking } from '../../types';

const STATUS_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const STATUS_CFG: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: '#DCFCE7', text: '#16A34A', label: 'Confirmed' },
  completed: { bg: '#F0F0F0', text: '#6B7280', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
  pending:   { bg: '#FEF9C3', text: '#CA8A04', label: 'Pending' },
};

function BookingRow({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const s = STATUS_CFG[booking.status] ?? STATUS_CFG.pending;
  const start = new Date(booking.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const end = new Date(booking.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {booking.car?.images?.[0] ? (
        <Image source={{ uri: booking.car.images[0] }} style={styles.cardImg} contentFit="cover" />
      ) : (
        <View style={[styles.cardImg, { backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="car-outline" size={28} color={C.muted} />
        </View>
      )}
      <View style={styles.cardInfo}>
        <View style={styles.cardTopRow}>
          <Text style={styles.carName} numberOfLines={1}>{booking.car?.make ?? '—'} {booking.car?.model ?? ''}</Text>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text>
          </View>
        </View>
        <Text style={styles.dateText}>{start} – {end}</Text>
        <Text style={styles.priceText}>${booking.total_price} total</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { data: bookings = [], isLoading } = useBookings();

  const filtered = bookings.filter((b) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return b.status === 'confirmed';
    if (activeTab === 2) return b.status === 'completed';
    if (activeTab === 3) return b.status === 'cancelled';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      <View style={styles.tabsRow}>
        {STATUS_TABS.map((tab, i) => (
          <TouchableOpacity key={tab} style={[styles.tabChip, activeTab === i && styles.tabChipActive]} onPress={() => setActiveTab(i)} activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <View style={styles.centerBox}><Text style={{ color: C.muted }}>Loading...</Text></View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="clipboard-outline" size={52} color={C.border} />
          <Text style={{ color: C.muted, marginTop: 14, fontSize: 15 }}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <BookingRow booking={item} onPress={() => router.push(`/bookings/${item.id}`)} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.dark },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 20 },
  tabChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  tabChipActive: { backgroundColor: C.dark, borderColor: C.dark },
  tabText: { fontSize: 13, fontWeight: '600', color: C.dark },
  tabTextActive: { color: '#FFF' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  listContent: { paddingHorizontal: 24, gap: 12, paddingBottom: 110 },
  card: { backgroundColor: C.card, borderRadius: 18, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: C.border, height: 100 },
  cardImg: { width: 100, height: 100 },
  cardInfo: { flex: 1, padding: 12, gap: 5 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  carName: { fontSize: 14, fontWeight: '700', color: C.dark, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 12, color: C.muted },
  priceText: { fontSize: 14, fontWeight: '700', color: C.dark },
});
