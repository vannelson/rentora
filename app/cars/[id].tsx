import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useCar } from '../../features/cars/hooks/useCars';
import { C } from '../../lib/design';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
const CAR_FEATURES = (car: any): { icon: IoniconName; label: string; value: string }[] => [
  { icon: 'people-outline',      label: 'Capacity',     value: `${car.seats} Seats` },
  { icon: 'cog-outline',         label: 'Transmission', value: car.transmission === 'automatic' ? 'Auto' : 'Manual' },
  { icon: 'flame-outline',       label: 'Fuel',         value: car.fuel_type },
  { icon: 'speedometer-outline', label: 'Mileage',      value: `${car.mileage_limit}km` },
  { icon: 'calendar-outline',    label: 'Year',         value: String(car.year) },
  { icon: 'star-outline',        label: 'Rating',       value: `${car.rating}/5.0` },
];

const MOCK_REVIEWS = [
  { name: 'Mr. Jack', rating: 5, text: 'The rental car was clean, reliable, and the service was quick and efficient.' },
  { name: 'Robert',   rating: 5, text: 'Great experience, the car was in perfect condition and pickup was smooth.' },
];

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: car, isLoading } = useCar(id!);

  if (isLoading) return <LoadingScreen />;
  if (!car) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={{ color: C.muted }}>Car not found.</Text>
          <TouchableOpacity style={styles.backBtnSm} onPress={() => router.back()}>
            <Text style={{ color: C.dark, fontWeight: '600' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={C.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Details</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color={C.dark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.carImgWrap}>
            <Image source={{ uri: car.images[0] }} style={styles.carImg} contentFit="cover" transition={300} />
            <TouchableOpacity style={styles.heartFab}>
              <Ionicons name="heart-outline" size={18} color={C.mutedDark} />
            </TouchableOpacity>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.carName}>{car.make} {car.model}</Text>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={15} color={C.star} />
                <Text style={styles.ratingNum}>{car.rating.toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({car.rating_count}+)</Text>
              </View>
            </View>
            <Text style={styles.carDesc}>{car.description}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={C.muted} />
              <Text style={styles.locationText}>{car.pickup_address}</Text>
            </View>

            <View style={styles.divider} />

            {/* Owner card */}
            <View style={styles.ownerCard}>
              <View style={styles.ownerAvatar}>
                <Text style={{ fontSize: 22 }}>👩</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ownerName}>Hela Quintin</Text>
                <Text style={styles.ownerRole}>Car Owner · Verified</Text>
              </View>
              <TouchableOpacity style={styles.ownerActionBtn}>
                <Ionicons name="call-outline" size={16} color={C.dark} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ownerActionBtn}>
                <Ionicons name="chatbubble-outline" size={16} color={C.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Car features</Text>
            <View style={styles.featuresGrid}>
              {CAR_FEATURES(car).map((f) => (
                <View key={f.label} style={styles.featureItem}>
                  <Ionicons name={f.icon} size={22} color={C.dark} style={{ marginBottom: 6 }} />
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureValue}>{f.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Review ({car.rating_count})</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {MOCK_REVIEWS.map((review) => (
                <View key={review.name} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <View style={styles.reviewAvatar}>
                      <Ionicons name="person" size={16} color={C.mutedDark} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Ionicons key={i} name="star" size={10} color={C.star} />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ height: 110 }} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push(`/bookings/create?carId=${car.id}`)} activeOpacity={0.88}>
          <Text style={styles.bookNowText}>Book Now  →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  safe: { flex: 1 },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  backBtnSm: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: C.border, borderRadius: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.dark },
  scroll: { flex: 1 },
  carImgWrap: { height: 240, position: 'relative' },
  carImg: { width: '100%', height: 240 },
  heartFab: { position: 'absolute', top: 16, right: 20, width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  dots: { position: 'absolute', bottom: 14, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 20, backgroundColor: '#FFF' },
  body: { paddingHorizontal: 24, paddingTop: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  carName: { fontSize: 22, fontWeight: '800', color: C.dark, flex: 1, marginRight: 12 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingNum: { fontSize: 16, fontWeight: '700', color: C.dark },
  ratingCount: { fontSize: 11, color: C.muted },
  carDesc: { fontSize: 14, color: C.mutedDark, lineHeight: 22, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  locationText: { fontSize: 13, color: C.muted },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 20 },
  ownerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: C.border },
  ownerAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFE5D0', alignItems: 'center', justifyContent: 'center' },
  ownerName: { fontSize: 15, fontWeight: '700', color: C.dark },
  ownerRole: { fontSize: 12, color: C.muted },
  ownerActionBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.dark, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, color: C.mutedDark, fontWeight: '600' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  featureItem: { width: '30%', backgroundColor: C.card, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  featureLabel: { fontSize: 11, color: C.muted, marginBottom: 2 },
  featureValue: { fontSize: 13, fontWeight: '700', color: C.dark, textAlign: 'center' },
  reviewCard: { width: 200, backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: 13, fontWeight: '700', color: C.dark, marginBottom: 2 },
  reviewText: { fontSize: 12, color: C.mutedDark, lineHeight: 18 },
  stickyBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 34, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  bookNowBtn: { backgroundColor: C.dark, borderRadius: 30, height: 56, alignItems: 'center', justifyContent: 'center' },
  bookNowText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});
