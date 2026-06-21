import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../lib/design';

const HISTOGRAM = [2, 3, 5, 7, 9, 12, 16, 20, 22, 20, 17, 14, 11, 8, 6, 5, 4, 5, 7, 6];
const CAR_TYPES = ['All Cars', 'Regular Cars', 'Luxury Cars'];
const RENTAL_TIMES = ['Hour', 'Day', 'Weekly', 'Monthly'];
const COLORS = [
  { name: 'White', bg: '#FFFFFF', border: '#D1D5DB' },
  { name: 'Gray',  bg: '#9CA3AF', border: '#9CA3AF' },
  { name: 'Blue',  bg: '#3B82F6', border: '#3B82F6' },
  { name: 'Black', bg: '#111827', border: '#111827' },
];
const CAPACITIES = ['2', '4', '6', '8'];
const FUEL_TYPES = ['Electric', 'Petrol', 'Diesel', 'Hybrid'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

function DatePickerModal({ visible, onClose, onDone }: {
  visible: boolean; onClose: () => void; onDone: (label: string) => void;
}) {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(0);
  const [start, setStart] = useState<number | null>(19);
  const [end, setEnd]     = useState<number | null>(22);

  function handleDay(d: number) {
    if (!start || (start && end)) { setStart(d); setEnd(null); }
    else if (d < start) { setEnd(start); setStart(d); }
    else setEnd(d);
  }

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  const total = getDaysInMonth(year, month);
  const first = getFirstDay(year, month);
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={dp.overlay}>
        <View style={dp.sheet}>
          <Text style={dp.title}>Time</Text>
          <View style={dp.timeRow}>
            <View style={dp.timeActive}>
              <Ionicons name="time-outline" size={14} color="#FFF" />
              <Text style={dp.timeActiveText}>10 : 30  am</Text>
            </View>
            <View style={dp.timeInactive}>
              <Ionicons name="time-outline" size={14} color="#888" />
              <Text style={dp.timeInactiveText}>05 : 30  pm</Text>
            </View>
          </View>

          <View style={dp.calHeader}>
            <TouchableOpacity onPress={prevMonth} hitSlop={12}><Text style={dp.arrow}>{'<'}</Text></TouchableOpacity>
            <Text style={dp.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={12}><Text style={dp.arrow}>{'>'}</Text></TouchableOpacity>
          </View>

          <View style={dp.dayNames}>
            {DAY_NAMES.map(d => <Text key={d} style={dp.dayName}>{d}</Text>)}
          </View>

          <View style={dp.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={i} style={dp.cell} />;
              const isEdge  = day === start || day === end;
              const inRange = start && end && day > Math.min(start, end) && day < Math.max(start, end);
              return (
                <TouchableOpacity key={i} style={[dp.cell, isEdge && dp.cellEdge, !!inRange && dp.cellRange]} onPress={() => handleDay(day)}>
                  <Text style={[dp.cellText, isEdge && dp.cellTextEdge, !!inRange && dp.cellTextRange]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={dp.btnRow}>
            <TouchableOpacity style={dp.cancelBtn} onPress={onClose}>
              <Text style={dp.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dp.doneBtn} onPress={() => { onDone(`${start} ${MONTH_NAMES[month].slice(0,3)} – ${end} ${MONTH_NAMES[month].slice(0,3)}`); onClose(); }}>
              <Text style={dp.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function FiltersScreen() {
  const router = useRouter();
  const [carType,    setCarType]    = useState(0);
  const [rental,     setRental]     = useState(1);
  const [colors,     setColors]     = useState<number[]>([2]);
  const [capacity,   setCapacity]   = useState(1);
  const [fuel,       setFuel]       = useState(0);
  const [dateLabel,  setDateLabel]  = useState('05 Jun, 2024');
  const [location,   setLocation]   = useState('');
  const [showDate,   setShowDate]   = useState(false);

  function toggleColor(i: number) {
    setColors(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function clearAll() {
    setCarType(0); setRental(0); setColors([]); setCapacity(0); setFuel(0); setLocation('');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <DatePickerModal visible={showDate} onClose={() => setShowDate(false)} onDone={setDateLabel} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Ionicons name="close" size={22} color={C.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Filters</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Type of Cars */}
        <Text style={s.label}>Type of Cars</Text>
        <View style={s.row}>
          {CAR_TYPES.map((t, i) => (
            <TouchableOpacity key={t} style={[s.pill, carType === i && s.pillActive]} onPress={() => setCarType(i)}>
              <Text style={[s.pillText, carType === i && s.pillTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range */}
        <Text style={[s.label, { marginTop: 24 }]}>Price range</Text>
        <View style={s.histogram}>
          {HISTOGRAM.map((h, i) => (
            <View key={i} style={[s.bar, { height: h * 3.2 }]} />
          ))}
        </View>
        <View style={s.sliderTrack}>
          <View style={s.sliderFill} />
          <View style={[s.thumb, { left: 0 }]} />
          <View style={[s.thumb, { right: 0 }]} />
        </View>
        <View style={s.priceRow}>
          <View style={s.priceBox}><Text style={s.priceText}>Minimum</Text><Text style={s.priceVal}>$10</Text></View>
          <View style={[s.priceBox, { alignItems: 'flex-end' }]}><Text style={s.priceText}>Maximum</Text><Text style={s.priceVal}>$230+</Text></View>
        </View>

        {/* Rental Time */}
        <Text style={[s.label, { marginTop: 24 }]}>Rental Time</Text>
        <View style={s.row}>
          {RENTAL_TIMES.map((t, i) => (
            <TouchableOpacity key={t} style={[s.outline, rental === i && s.outlineActive]} onPress={() => setRental(i)}>
              <Text style={[s.outlineText, rental === i && s.outlineTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pick up Date */}
        <View style={s.rowBetween}>
          <Text style={[s.label, { marginTop: 20 }]}>Pick up and Drop Date</Text>
          <TouchableOpacity style={s.dateBtn} onPress={() => setShowDate(true)}>
            <Ionicons name="calendar-outline" size={14} color={C.mutedDark} />
            <Text style={s.dateBtnText}>{dateLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={C.mutedDark} />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <Text style={[s.label, { marginTop: 16 }]}>Car Location</Text>
        <View style={s.locationBox}>
          <Ionicons name="location-outline" size={16} color={C.muted} />
          <TextInput
            style={s.locationInput}
            placeholder="Shere Dr, Chicago 0062 Usa"
            placeholderTextColor={C.muted}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Colors */}
        <View style={[s.rowBetween, { marginTop: 20 }]}>
          <Text style={s.label}>Colors</Text>
          <TouchableOpacity><Text style={s.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={[s.row, { marginTop: 10, gap: 12 }]}>
          {COLORS.map((c, i) => (
            <TouchableOpacity
              key={c.name}
              style={[s.colorCircle, { backgroundColor: c.bg, borderColor: colors.includes(i) ? C.dark : c.border, borderWidth: colors.includes(i) ? 2.5 : 1 }]}
              onPress={() => toggleColor(i)}
            >
              {colors.includes(i) && <Ionicons name="checkmark" size={13} color={i === 0 ? '#555' : '#FFF'} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sitting Capacity */}
        <Text style={[s.label, { marginTop: 20 }]}>Siting Capacity</Text>
        <View style={s.row}>
          {CAPACITIES.map((c, i) => (
            <TouchableOpacity key={c} style={[s.capacityChip, capacity === i && s.pillActive]} onPress={() => setCapacity(i)}>
              <Text style={[s.pillText, capacity === i && s.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fuel Type */}
        <Text style={[s.label, { marginTop: 20 }]}>Fuel Type</Text>
        <View style={s.row}>
          {FUEL_TYPES.map((f, i) => (
            <TouchableOpacity key={f} style={[s.outline, fuel === i && s.outlineActive]} onPress={() => setFuel(i)}>
              <Text style={[s.outlineText, fuel === i && s.outlineTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
          <Text style={s.clearText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.showBtn} onPress={() => router.back()}>
          <Text style={s.showText}>Show 100+ Cars</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: C.border },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.dark },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  label: { fontSize: 15, fontWeight: '700', color: C.dark, marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: C.border },
  pillActive: { backgroundColor: C.dark, borderColor: C.dark },
  pillText: { fontSize: 13, fontWeight: '600', color: C.dark },
  pillTextActive: { color: '#FFF' },
  outline: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 24, borderWidth: 1, borderColor: C.border, backgroundColor: '#FFF' },
  outlineActive: { borderColor: C.dark, backgroundColor: '#FFF' },
  outlineText: { fontSize: 13, color: C.mutedDark, fontWeight: '500' },
  outlineTextActive: { color: C.dark, fontWeight: '700' },
  histogram: { flexDirection: 'row', alignItems: 'flex-end', height: 70, gap: 3, marginBottom: 8 },
  bar: { flex: 1, backgroundColor: '#D1D5DB', borderRadius: 2 },
  sliderTrack: { height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, marginBottom: 12, position: 'relative', justifyContent: 'center' },
  sliderFill: { position: 'absolute', left: '10%', right: '15%', height: 4, backgroundColor: C.dark, borderRadius: 2 },
  thumb: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF', borderWidth: 2, borderColor: C.dark, top: -7 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  priceBox: { gap: 2 },
  priceText: { fontSize: 11, color: C.muted },
  priceVal: { fontSize: 14, fontWeight: '700', color: C.dark, backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.border, marginTop: 4 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 20 },
  dateBtnText: { fontSize: 13, color: C.mutedDark },
  locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 50, gap: 8 },
  locationInput: { flex: 1, fontSize: 14, color: C.dark },
  seeAll: { fontSize: 13, color: C.mutedDark, fontWeight: '600' },
  colorCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  capacityChip: { width: 52, height: 42, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  bottomBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 28, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: C.border },
  clearBtn: { flex: 1, height: 52, borderRadius: 30, borderWidth: 1.5, borderColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 15, fontWeight: '700', color: C.dark },
  showBtn: { flex: 2, height: 52, borderRadius: 30, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  showText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});

const dp = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sheet: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: '100%' },
  title: { fontSize: 17, fontWeight: '700', color: C.dark, marginBottom: 14 },
  timeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  timeActive: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.dark, borderRadius: 30, paddingVertical: 12, paddingHorizontal: 16 },
  timeActiveText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  timeInactive: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 16 },
  timeInactiveText: { color: '#888', fontSize: 15, fontWeight: '600' },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  arrow: { fontSize: 18, color: C.dark, paddingHorizontal: 8 },
  monthLabel: { fontSize: 16, fontWeight: '700', color: C.dark },
  dayNames: { flexDirection: 'row', marginBottom: 8 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 12, color: C.muted, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cellEdge: { backgroundColor: C.dark, borderRadius: 20 },
  cellRange: { backgroundColor: '#F3F4F6' },
  cellText: { fontSize: 14, color: C.dark },
  cellTextEdge: { color: '#FFF', fontWeight: '700' },
  cellTextRange: { color: C.dark },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, height: 48, borderRadius: 30, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600', color: C.dark },
  doneBtn: { flex: 1, height: 48, borderRadius: 30, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
