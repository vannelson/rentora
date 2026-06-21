import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../../features/bookings/hooks/useBookings';
import { C } from '../../lib/design';

export default function AlertsScreen() {
  const { data: bookings = [] } = useBookings();

  const upcoming = bookings.filter((b) => b.status === 'confirmed');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Notifications</Text>

        {upcoming.length === 0 && past.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 48 }}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>Your booking updates will appear here</Text>
          </View>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Upcoming</Text>
                {upcoming.map((b) => (
                  <View key={b.id} style={styles.notifCard}>
                    <View style={[styles.notifIcon, { backgroundColor: '#DCFCE7' }]}>
                      <Text style={{ fontSize: 20 }}>🚗</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifTitle}>Booking Confirmed</Text>
                      <Text style={styles.notifBody} numberOfLines={2}>
                        {b.car?.make ?? '—'} {b.car?.model ?? ''} · {new Date(b.start_date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.notifTime}>Pickup upcoming</Text>
                    </View>
                    <View style={[styles.dot, { backgroundColor: C.success }]} />
                  </View>
                ))}
              </>
            )}

            {past.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Earlier</Text>
                {past.map((b) => (
                  <View key={b.id} style={styles.notifCard}>
                    <View style={[styles.notifIcon, { backgroundColor: '#F0F0F0' }]}>
                      <Text style={{ fontSize: 20 }}>📋</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifTitle}>
                        Booking {b.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </Text>
                      <Text style={styles.notifBody} numberOfLines={2}>
                        {b.car?.make ?? '—'} {b.car?.model ?? ''} · ${b.total_price}
                      </Text>
                      <Text style={styles.notifTime}>{new Date(b.end_date).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: C.dark, paddingTop: 8, marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  emptyBox: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyText: { fontSize: 17, fontWeight: '700', color: C.dark },
  emptySubText: { fontSize: 13, color: C.muted, textAlign: 'center' },
  notifCard: { backgroundColor: C.card, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  notifIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: C.dark, marginBottom: 2 },
  notifBody: { fontSize: 12, color: C.muted },
  notifTime: { fontSize: 11, color: C.muted, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
