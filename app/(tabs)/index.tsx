import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCars } from '../../features/cars/hooks/useCars';
import { C } from '../../lib/design';
import { useAuthStore } from '../../stores/auth.store';
import type { Car } from '../../types';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = (SCREEN_W - 48 - 12) / 2;

const BRANDS = ['ALL', 'Sedan', 'SUV', 'Electric', 'Luxury'];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={11} color={C.star} />
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.dark }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function CarGridCard({ car, onPress }: { car: Car; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.gridCard, { width: CARD_W }]} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.gridImgWrap}>
        <Image source={{ uri: car.images[0] }} style={styles.gridImg} contentFit="cover" transition={300} />
        <TouchableOpacity style={styles.heartBtn} hitSlop={8}>
          <Ionicons name="heart-outline" size={13} color={C.mutedDark} />
        </TouchableOpacity>
      </View>
      <View style={styles.gridInfo}>
        <StarRow rating={car.rating} />
        <Text style={styles.gridCarName} numberOfLines={1}>{car.make} {car.model}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="location-outline" size={11} color={C.muted} />
          <Text style={styles.gridLocation} numberOfLines={1}>{car.pickup_address.split(',')[0]}</Text>
        </View>
        <View style={styles.gridBottom}>
          <Text style={styles.gridPrice}>${car.price_per_day}<Text style={styles.gridPriceUnit}>/Day</Text></Text>
          <TouchableOpacity style={styles.bookNowBtn} onPress={onPress}>
            <Text style={styles.bookNowText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PopularCard({ car, onPress }: { car: Car; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.popularCard} onPress={onPress} activeOpacity={0.88}>
      <Image source={{ uri: car.images[0] }} style={styles.popularImg} contentFit="cover" transition={300} />
      <View style={styles.popularInfo}>
        <Text style={styles.popularName} numberOfLines={1}>{car.make} {car.model}</Text>
        <StarRow rating={car.rating} />
        <Text style={styles.popularPrice}>${car.price_per_day}/Day</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(0);
  const { data: cars = [], isLoading } = useCars();

  const recommended = cars.slice(0, 4);
  const popular = cars.slice(4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hi, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋</Text>
            <Text style={styles.subGreeting}>Find your perfect ride</Text>
          </View>
          <TouchableOpacity style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={20} color={C.mutedDark} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={C.muted} />
            <TextInput style={styles.searchInput} placeholder="Search your dream car..." placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/filters')}>
            <Ionicons name="options-outline" size={20} color={C.dark} />
          </TouchableOpacity>
        </View>

        {/* Brand filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsScroll} contentContainerStyle={styles.brandsContent}>
          {BRANDS.map((brand, i) => (
            <TouchableOpacity key={brand} style={[styles.brandChip, selectedBrand === i && styles.brandChipActive]} onPress={() => setSelectedBrand(i)} activeOpacity={0.8}>
              <Text style={[styles.brandChipText, selectedBrand === i && styles.brandChipTextActive]}>{brand}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommend For You</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}><Text style={{ color: C.muted }}>Loading cars...</Text></View>
        ) : (
          <FlatList
            data={recommended}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            renderItem={({ item }) => <CarGridCard car={item} onPress={() => router.push(`/cars/${item.id}`)} />}
          />
        )}

        {/* Popular */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Our Popular Cars</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularContent}>
          {popular.map((car) => <PopularCard key={car.id} car={car} onPress={() => router.push(`/cars/${car.id}`)} />)}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, marginBottom: 20 },
  greeting: { fontSize: 18, fontWeight: '700', color: C.dark },
  subGreeting: { fontSize: 13, color: C.muted, marginTop: 2 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 20, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 30, paddingHorizontal: 16, height: 50, gap: 8, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, fontSize: 14, color: C.dark },
  filterBtn: { width: 50, height: 50, backgroundColor: C.card, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  brandsScroll: { marginBottom: 24 },
  brandsContent: { paddingHorizontal: 24, gap: 10 },
  brandChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  brandChipActive: { backgroundColor: C.dark, borderColor: C.dark },
  brandChipText: { fontSize: 13, fontWeight: '600', color: C.dark },
  brandChipTextActive: { color: '#FFF' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.dark },
  viewAll: { fontSize: 13, fontWeight: '600', color: C.mutedDark },
  loadingBox: { height: 180, alignItems: 'center', justifyContent: 'center' },
  gridRow: { gap: 12, marginBottom: 12 },
  gridCard: { backgroundColor: C.card, borderRadius: 18, overflow: 'hidden' },
  gridImgWrap: { position: 'relative', height: 120 },
  gridImg: { width: '100%', height: 120 },
  heartBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  gridInfo: { padding: 10, gap: 3 },
  gridCarName: { fontSize: 14, fontWeight: '700', color: C.dark },
  gridLocation: { fontSize: 11, color: C.muted },
  gridBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  gridPrice: { fontSize: 13, fontWeight: '700', color: C.dark },
  gridPriceUnit: { fontSize: 11, fontWeight: '400', color: C.muted },
  bookNowBtn: { backgroundColor: C.dark, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  bookNowText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  popularContent: { paddingHorizontal: 24, gap: 12, paddingBottom: 8 },
  popularCard: { width: 155, backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  popularImg: { width: 155, height: 95 },
  popularInfo: { padding: 10, gap: 3 },
  popularName: { fontSize: 13, fontWeight: '700', color: C.dark },
  popularPrice: { fontSize: 12, color: C.muted, marginTop: 2 },
});
