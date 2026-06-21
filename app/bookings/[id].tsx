import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useBooking, useCancelBooking } from '../../features/bookings/hooks/useBookings';
import { C } from '../../lib/design';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: '#DCFCE7', text: '#16A34A' },
  completed: { bg: '#F0F0F0', text: '#6B7280' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  pending:   { bg: '#FEF9C3', text: '#CA8A04' },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: booking, isLoading } = useBooking(id!);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  if (isLoading) return <LoadingScreen />;
  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={{ color: C.muted, fontSize: 15 }}>Booking not found.</Text>
          <TouchableOpacity style={styles.backBtnSm} onPress={() => router.back()}>
            <Text style={{ color: C.dark, fontWeight: '600' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending;
  const startFmt = new Date(booking.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const endFmt = new Date(booking.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  function handleCancel() {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          if (!booking) return;
          const bookingId = booking.id;
          cancelBooking(bookingId, { onSuccess: () => router.back() });
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Text style={{ fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={{ fontSize: 16 }}>···</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Car Image */}
          <View style={styles.carImgBox}>
            <Text style={{ fontSize: 80 }}>🚗</Text>
          </View>

          {/* Car info */}
          <View style={styles.section}>
            <View style={styles.carTitleRow}>
              <Text style={styles.carName}>
                {booking.car ? `${booking.car.make} ${booking.car.model}` : 'Car Booking'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.statusText, { color: statusCfg.text }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </View>
            {booking.car && (
              <Text style={styles.carDesc}>{booking.car.description}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Booking info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Information</Text>
            {[
              ['Booking ID', `#${booking.id.split('-').pop()?.toUpperCase()}`],
              ['Pick up Date', startFmt],
              ['Return Date', endFmt],
              ['Location', booking.pickup_location],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>• {label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Payment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            {[
              ['Amount', `$${booking.total_price}`],
              ['Service fee', '$15'],
              ['Total amount', `$${booking.total_price + 15}`],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, label === 'Total amount' && { fontWeight: '800', color: C.dark }]}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Cancel button */}
          {booking.status === 'confirmed' && (
            <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 100 }}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
                disabled={isCancelling}
                activeOpacity={0.85}
              >
                <Text style={styles.cancelText}>{isCancelling ? 'Cancelling...' : 'Cancel Booking'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {booking.status !== 'confirmed' && <View style={{ height: 40 }} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  backBtnSm: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: C.border, borderRadius: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.dark },
  body: { paddingBottom: 40 },
  carImgBox: { height: 220, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24, borderRadius: 20, marginBottom: 20 },
  section: { paddingHorizontal: 24, marginBottom: 16 },
  carTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  carName: { fontSize: 20, fontWeight: '800', color: C.dark, flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  carDesc: { fontSize: 13, color: C.muted, lineHeight: 20 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.dark, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel: { fontSize: 13, color: C.muted, flex: 1 },
  infoValue: { fontSize: 13, color: C.dark, fontWeight: '600', flex: 1.2, textAlign: 'right' },
  cancelBtn: { backgroundColor: '#FEE2E2', borderRadius: 30, height: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FECACA' },
  cancelText: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
});
