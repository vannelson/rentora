import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateBooking } from '../../features/bookings/hooks/useBookings';
import { useCar } from '../../features/cars/hooks/useCars';
import { C } from '../../lib/design';

const STEPS        = ['Booking details', 'Payment methods', 'Confirmation'];
const RENTAL_TIMES = ['Hour', 'Day', 'Weekly', 'Monthly'];
const GENDERS      = ['Male', 'Female', 'Others'];
const MONTH_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

function pad(n: number) { return String(n).padStart(2, '0'); }

function TimeInput({
  hour, minute, meridiem, active,
  onHourChange, onMinuteChange, onMeridiemToggle,
}: {
  hour: string; minute: string; meridiem: 'am' | 'pm'; active: boolean;
  onHourChange: (v: string) => void; onMinuteChange: (v: string) => void; onMeridiemToggle: () => void;
}) {
  const pill  = active ? cal.timeActive   : cal.timeInactive;
  const tNum  = active ? cal.timeNumDark  : cal.timeNumLight;
  const tSep  = active ? cal.timeSepDark  : cal.timeSepLight;
  const tAmpm = active ? cal.timeAmpmDark : cal.timeAmpmLight;

  return (
    <View style={[cal.timePill, pill]}>
      <Ionicons name="time-outline" size={15} color={active ? '#FFF' : '#888'} />
      <TextInput
        style={tNum}
        value={hour}
        onChangeText={v => { const n = v.replace(/\D/g, ''); if (n === '' || (parseInt(n) >= 1 && parseInt(n) <= 12)) onHourChange(n); }}
        keyboardType="number-pad"
        maxLength={2}
        selectTextOnFocus
      />
      <Text style={tSep}>:</Text>
      <TextInput
        style={tNum}
        value={minute}
        onChangeText={v => { const n = v.replace(/\D/g, ''); if (n === '' || parseInt(n) <= 59) onMinuteChange(n); }}
        keyboardType="number-pad"
        maxLength={2}
        selectTextOnFocus
      />
      <TouchableOpacity onPress={onMeridiemToggle} hitSlop={8}>
        <Text style={tAmpm}>{meridiem}</Text>
      </TouchableOpacity>
    </View>
  );
}

function CalendarModal({ visible, onClose, onDone }: {
  visible: boolean; onClose: () => void; onDone: (label: string, date: string) => void;
}) {
  const [year,  setYear]  = useState(2024);
  const [month, setMonth] = useState(0);
  const [start, setStart] = useState<number | null>(19);
  const [end,   setEnd]   = useState<number | null>(22);

  const [sHour, setSHour]       = useState('10');
  const [sMin,  setSMin]        = useState('30');
  const [sMer,  setSMer]        = useState<'am'|'pm'>('am');
  const [eHour, setEHour]       = useState('05');
  const [eMin,  setEMin]        = useState('30');
  const [eMer,  setEMer]        = useState<'am'|'pm'>('pm');
  const [activeTime, setActive] = useState<'start'|'end'>('start');

  function handleDay(d: number) {
    if (!start || (start && end)) { setStart(d); setEnd(null); }
    else if (d < start)           { setEnd(start); setStart(d); }
    else                          setEnd(d);
  }

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11){ setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); }

  const total = getDaysInMonth(year, month);
  const first = getFirstDay(year, month);
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const mon = MONTH_NAMES[month];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={cal.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={cal.sheet}>
            {/* Drag handle */}
            <View style={cal.handle} />

            <Text style={cal.sheetTitle}>Time</Text>

            {/* Time pickers */}
            <View style={cal.timeRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setActive('start')} activeOpacity={1}>
                <TimeInput
                  hour={sHour} minute={sMin} meridiem={sMer} active={activeTime === 'start'}
                  onHourChange={setSHour} onMinuteChange={setSMin}
                  onMeridiemToggle={() => setSMer(m => m === 'am' ? 'pm' : 'am')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setActive('end')} activeOpacity={1}>
                <TimeInput
                  hour={eHour} minute={eMin} meridiem={eMer} active={activeTime === 'end'}
                  onHourChange={setEHour} onMinuteChange={setEMin}
                  onMeridiemToggle={() => setEMer(m => m === 'am' ? 'pm' : 'am')}
                />
              </TouchableOpacity>
            </View>

            {/* Month nav */}
            <View style={cal.calHeader}>
              <TouchableOpacity onPress={prevMonth} hitSlop={12}>
                <Ionicons name="chevron-back" size={20} color={C.dark} />
              </TouchableOpacity>
              <Text style={cal.monthLabel}>{mon} {year}</Text>
              <TouchableOpacity onPress={nextMonth} hitSlop={12}>
                <Ionicons name="chevron-forward" size={20} color={C.dark} />
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={cal.dayNames}>
              {DAY_NAMES.map(d => <Text key={d} style={cal.dayName}>{d}</Text>)}
            </View>

            {/* Grid */}
            <View style={cal.grid}>
              {cells.map((day, i) => {
                if (!day) return <View key={i} style={cal.cell} />;
                const isEdge  = day === start || day === end;
                const inRange = !!(start && end && day > Math.min(start, end) && day < Math.max(start, end));
                return (
                  <TouchableOpacity
                    key={i}
                    style={[cal.cell, isEdge && cal.cellEdge, inRange && cal.cellRange]}
                    onPress={() => handleDay(day)}
                  >
                    <Text style={[cal.cellText, isEdge && cal.cellTextEdge, inRange && cal.cellTextRange]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Buttons */}
            <View style={cal.btnRow}>
              <TouchableOpacity style={cal.cancelBtn} onPress={onClose}>
                <Text style={cal.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={cal.doneBtn}
                onPress={() => {
                  const d    = start ?? 1;
                  const label = `${d} / ${mon.slice(0,3)} / ${year}`;
                  const date  = `${year}-${pad(month + 1)}-${pad(d)}`;
                  onDone(label, date);
                  onClose();
                }}
              >
                <Text style={cal.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <View style={s.stepRow}>
      {STEPS.map((_, i) => {
        const done = i < step; const active = i === step;
        return (
          <View key={i} style={s.stepItem}>
            <View style={[s.stepCircle, (done || active) && s.stepFilled]}>
              {done
                ? <Ionicons name="checkmark" size={12} color="#FFF" />
                : <View style={[s.stepDot, active && { backgroundColor: '#FFF' }]} />}
            </View>
            {i < STEPS.length - 1 && <View style={[s.stepLine, (done || active) && s.stepLineActive]} />}
          </View>
        );
      })}
    </View>
  );
}

function FormInput({ icon, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry = false, autoCapitalize = 'sentences' as any }) {
  return (
    <View style={s.inputWrap}>
      {icon && <Ionicons name={icon} size={18} color={C.muted} />}
      <TextInput
        style={s.inputField}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

export default function CreateBookingScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams<{ carId: string }>();
  const { data: car } = useCar(carId ?? '');
  const { mutate: createBooking } = useCreateBooking();

  const [step,       setStep]       = useState(0);
  const [withDriver, setWithDriver] = useState(false);
  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [contact,    setContact]    = useState('');
  const [gender,     setGender]     = useState(0);
  const [rentalTime, setRentalTime] = useState(1);
  const [location,   setLocation]   = useState('Shore Dr, Chicago 0062 Usa');

  const [pickupLabel, setPickupLabel] = useState('19 / Jan / 2024');
  const [returnLabel, setReturnLabel] = useState('22 / Jan / 2024');
  const [pickupDate,  setPickupDate]  = useState('2024-01-19');
  const [returnDate,  setReturnDate]  = useState('2024-01-22');
  const [showPickup,  setShowPickup]  = useState(false);
  const [showReturn,  setShowReturn]  = useState(false);

  const [cardName,   setCardName]   = useState('');
  const [cardEmail,  setCardEmail]  = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC,    setCardCVC]    = useState('');

  const totalPrice = (car?.price_per_day ?? 100) * 3;

  function handleNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else createBooking(
      { car_id: carId ?? '', start_date: pickupDate, end_date: returnDate, pickup_location: location, add_ons: [], total_price: totalPrice },
      { onSuccess: () => router.replace('/(tabs)/bookings'), onError: () => router.replace('/(tabs)/bookings') }
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CalendarModal visible={showPickup} onClose={() => setShowPickup(false)} onDone={(l, d) => { setPickupLabel(l); setPickupDate(d); }} />
      <CalendarModal visible={showReturn} onClose={() => setShowReturn(false)} onDone={(l, d) => { setReturnLabel(l); setReturnDate(d); }} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity style={s.headerBtn} onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
            <Ionicons name="arrow-back" size={20} color={C.dark} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{STEPS[step]}</Text>
          <TouchableOpacity style={s.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color={C.dark} />
          </TouchableOpacity>
        </View>

        <View style={s.stepWrap}>
          <StepIndicator step={step} />
          <View style={s.stepLabels}>
            {STEPS.map((label, i) => (
              <Text key={label} style={[s.stepLabel, i === step && s.stepLabelActive]} numberOfLines={1}>{label}</Text>
            ))}
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Step 0 ── */}
          {step === 0 && (
            <>
              <View style={s.fieldCard}>
                <Ionicons name="person-outline" size={20} color={C.dark} />
                <View style={{ flex: 1 }}>
                  <Text style={s.fieldTitle}>Book with driver</Text>
                  <Text style={s.fieldSub}>Don't have a driver? Book with driver.</Text>
                </View>
                <Switch value={withDriver} onValueChange={setWithDriver} trackColor={{ false: C.border, true: C.dark }} thumbColor="#FFF" />
              </View>

              <FormInput icon="person-outline"  placeholder="Full Name*"      value={fullName} onChangeText={setFullName} />
              <FormInput icon="mail-outline"    placeholder="Email Address*"  value={email}    onChangeText={setEmail}    keyboardType="email-address" autoCapitalize="none" />
              <FormInput icon="call-outline"    placeholder="Contact Number*" value={contact}  onChangeText={setContact}  keyboardType="phone-pad" />

              <Text style={s.sectionTitle}>Gender</Text>
              <View style={s.chipRow}>
                {GENDERS.map((g, i) => (
                  <TouchableOpacity key={g} style={[s.chip, gender === i && s.chipActive]} onPress={() => setGender(i)}>
                    <Ionicons name={i === 0 ? 'male-outline' : i === 1 ? 'female-outline' : 'male-female-outline'} size={14} color={gender === i ? '#FFF' : C.dark} />
                    <Text style={[s.chipText, gender === i && s.chipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.sectionTitle}>Rental Date & Time</Text>
              <View style={s.chipRow}>
                {RENTAL_TIMES.map((t, i) => (
                  <TouchableOpacity key={t} style={[s.chip, rentalTime === i && s.chipActive]} onPress={() => setRentalTime(i)}>
                    <Text style={[s.chipText, rentalTime === i && s.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.datesRow}>
                <View style={s.dateField}>
                  <Text style={s.dateLabel}>Pick up Date</Text>
                  <TouchableOpacity style={s.dateBtn} onPress={() => setShowPickup(true)}>
                    <Ionicons name="calendar-outline" size={16} color={C.mutedDark} />
                    <Text style={s.dateBtnText} numberOfLines={1}>{pickupLabel}</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.dateField}>
                  <Text style={s.dateLabel}>Return Date</Text>
                  <TouchableOpacity style={s.dateBtn} onPress={() => setShowReturn(true)}>
                    <Ionicons name="calendar-outline" size={16} color={C.mutedDark} />
                    <Text style={s.dateBtnText} numberOfLines={1}>{returnLabel}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={s.sectionTitle}>Car Location</Text>
              <FormInput icon="location-outline" placeholder="Location" value={location} onChangeText={setLocation} />
            </>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <View style={s.creditCard}>
                <View style={s.creditCardTop}>
                  <View style={s.cardChip} />
                  <Text style={s.cardVisa}>VISA</Text>
                </View>
                <Text style={s.cardNumber}>9655  9655  9655  9655</Text>
                <View style={s.creditCardBot}>
                  <Text style={s.cardHolder}>BENJAMIN JACK</Text>
                  <Text style={s.cardExpire}>Expire: 10-5-2030</Text>
                </View>
              </View>

              <Text style={s.sectionTitle}>Card information</Text>
              <FormInput icon="person-outline" placeholder="Full Name"       value={cardName}   onChangeText={setCardName} />
              <FormInput icon="mail-outline"   placeholder="Email Address"   value={cardEmail}  onChangeText={setCardEmail} keyboardType="email-address" autoCapitalize="none" />
              <FormInput icon="card-outline"   placeholder="Card Number"     value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[s.inputWrap, { flex: 1 }]}>
                  <TextInput style={s.inputField} placeholder="MM / YY" placeholderTextColor={C.muted} value={cardExpiry} onChangeText={setCardExpiry} />
                </View>
                <View style={[s.inputWrap, { flex: 1 }]}>
                  <TextInput style={s.inputField} placeholder="CVC" placeholderTextColor={C.muted} value={cardCVC} onChangeText={setCardCVC} keyboardType="number-pad" secureTextEntry />
                </View>
              </View>

              <View style={s.divider} />
              <TouchableOpacity style={s.socialBtn}>
                <Ionicons name="logo-apple" size={20} color={C.dark} />
                <Text style={s.socialText}>Apple Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.socialBtn}>
                <Text style={s.googleG}>G</Text>
                <Text style={s.socialText}>Google Pay</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && car && (
            <>
              {car.images?.[0]
                ? <Image source={{ uri: car.images[0] }} style={s.confirmImg} contentFit="cover" />
                : <View style={[s.confirmImg, { backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="car-outline" size={60} color={C.muted} />
                  </View>}

              <Text style={s.confirmCarName}>{car.make} {car.model}</Text>
              <View style={s.ratingRow}>
                <Ionicons name="star" size={14} color={C.star} />
                <Text style={s.ratingNum}>{car.rating.toFixed(1)}</Text>
                <Text style={s.ratingCount}>({car.rating_count}+ Reviews)</Text>
              </View>
              <Text style={s.confirmDesc}>{car.description}</Text>

              <View style={s.divider} />
              <Text style={s.sectionTitle}>Booking information</Text>
              {[
                ['Booking ID',   '00451'],
                ['Name',         fullName || 'Benjamin Jack'],
                ['Pick up Date', pickupLabel],
                ['Return Date',  returnLabel],
                ['Location',     location],
              ].map(([label, value]) => (
                <View key={label} style={s.infoRow}>
                  <Text style={s.infoLabel}>{label}</Text>
                  <Text style={s.infoValue} numberOfLines={2}>{value}</Text>
                </View>
              ))}

              <View style={s.divider} />
              <Text style={s.sectionTitle}>Payment</Text>
              {[
                ['Amount',       `$${totalPrice}`],
                ['Service fee',  '$15'],
                ['Total amount', `$${totalPrice + 15}`],
              ].map(([label, value]) => (
                <View key={label} style={s.infoRow}>
                  <Text style={s.infoLabel}>{label}</Text>
                  <Text style={[s.infoValue, label === 'Total amount' && { fontWeight: '800', color: C.dark }]}>{value}</Text>
                </View>
              ))}
            </>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>

      <View style={s.stickyBottom}>
        <TouchableOpacity style={s.payBtn} onPress={handleNext} activeOpacity={0.88}>
          <Text style={s.payBtnText}>
            {step === 0 ? `Pay Now  $${totalPrice}` : step === 1 ? 'Continue' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerBtn:       { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle:     { fontSize: 17, fontWeight: '700', color: C.dark },
  stepWrap:        { paddingHorizontal: 28, marginBottom: 8 },
  stepRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  stepItem:        { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepCircle:      { width: 24, height: 24, borderRadius: 12, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  stepFilled:      { backgroundColor: C.dark },
  stepDot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: C.muted },
  stepLine:        { flex: 1, height: 2, backgroundColor: C.border },
  stepLineActive:  { backgroundColor: C.dark },
  stepLabels:      { flexDirection: 'row', justifyContent: 'space-between' },
  stepLabel:       { fontSize: 10, color: C.muted, flex: 1, textAlign: 'center' },
  stepLabelActive: { color: C.dark, fontWeight: '700' },
  body:            { paddingHorizontal: 24, paddingTop: 12, gap: 14 },
  fieldCard:       { backgroundColor: C.card, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border },
  fieldTitle:      { fontSize: 14, fontWeight: '700', color: C.dark },
  fieldSub:        { fontSize: 12, color: C.muted, marginTop: 2 },
  inputWrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 30, height: 58, paddingHorizontal: 20, gap: 12 },
  inputField:      { flex: 1, fontSize: 15, color: C.dark },
  sectionTitle:    { fontSize: 15, fontWeight: '700', color: C.dark, marginTop: 2 },
  chipRow:         { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip:            { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipActive:      { backgroundColor: C.dark, borderColor: C.dark },
  chipText:        { fontSize: 13, fontWeight: '600', color: C.dark },
  chipTextActive:  { color: '#FFF' },
  datesRow:        { flexDirection: 'row', gap: 12 },
  dateField:       { flex: 1, gap: 8 },
  dateLabel:       { fontSize: 13, fontWeight: '600', color: C.dark },
  dateBtn:         { backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.border },
  dateBtnText:     { fontSize: 12, color: C.mutedDark, flex: 1 },
  creditCard:      { backgroundColor: C.dark, borderRadius: 22, padding: 26, height: 185, justifyContent: 'space-between' },
  creditCardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardChip:        { width: 38, height: 28, borderRadius: 6, backgroundColor: '#FFD700' },
  cardVisa:        { color: '#FFF', fontSize: 23, fontWeight: '700', fontStyle: 'italic' },
  cardNumber:      { color: '#FFF', fontSize: 18, fontWeight: '600', letterSpacing: 2 },
  creditCardBot:   { flexDirection: 'row', justifyContent: 'space-between' },
  cardHolder:      { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  cardExpire:      { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  divider:         { height: 1, backgroundColor: C.border },
  socialBtn:       { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 30, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  socialText:      { fontSize: 15, fontWeight: '600', color: C.dark },
  googleG:         { fontSize: 18, fontWeight: '900', color: '#4285F4', fontStyle: 'italic' },
  confirmImg:      { width: '100%', height: 190, borderRadius: 20 },
  confirmCarName:  { fontSize: 22, fontWeight: '800', color: C.dark, marginTop: 8 },
  ratingRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingNum:       { fontSize: 15, fontWeight: '700', color: C.dark },
  ratingCount:     { fontSize: 12, color: C.muted },
  confirmDesc:     { fontSize: 13, color: C.muted, lineHeight: 20, marginTop: 6 },
  infoRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel:       { fontSize: 13, color: C.muted, flex: 1 },
  infoValue:       { fontSize: 13, color: C.dark, fontWeight: '600', flex: 1.4, textAlign: 'right' },
  stickyBottom:    { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 34, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  payBtn:          { backgroundColor: C.dark, borderRadius: 30, height: 58, alignItems: 'center', justifyContent: 'center' },
  payBtnText:      { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

const cal = StyleSheet.create({
  overlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:          { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  handle:         { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 20 },
  sheetTitle:     { fontSize: 17, fontWeight: '700', color: C.dark, marginBottom: 16 },
  timeRow:        { flexDirection: 'row', gap: 10, marginBottom: 20 },
  timePill:       { flexDirection: 'row', alignItems: 'center', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 14, gap: 6 },
  timeActive:     { backgroundColor: C.dark },
  timeInactive:   { backgroundColor: '#F3F4F6' },
  timeNumDark:    { color: '#FFF', fontSize: 16, fontWeight: '700', width: 26, textAlign: 'center' },
  timeNumLight:   { color: '#555', fontSize: 16, fontWeight: '700', width: 26, textAlign: 'center' },
  timeSepDark:    { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '700' },
  timeSepLight:   { color: '#AAA', fontSize: 16, fontWeight: '700' },
  timeAmpmDark:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginLeft: 2 },
  timeAmpmLight:  { color: '#888', fontSize: 13, fontWeight: '600', marginLeft: 2 },
  calHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  arrow:          { fontSize: 18, color: C.dark, paddingHorizontal: 6 },
  monthLabel:     { fontSize: 16, fontWeight: '700', color: C.dark },
  dayNames:       { flexDirection: 'row', marginBottom: 6 },
  dayName:        { flex: 1, textAlign: 'center', fontSize: 11, color: C.muted, fontWeight: '600' },
  grid:           { flexDirection: 'row', flexWrap: 'wrap' },
  cell:           { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cellEdge:       { backgroundColor: C.dark, borderRadius: 20 },
  cellRange:      { backgroundColor: '#F3F4F6' },
  cellText:       { fontSize: 14, color: C.dark },
  cellTextEdge:   { color: '#FFF', fontWeight: '700' },
  cellTextRange:  { color: C.dark },
  btnRow:         { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn:      { flex: 1, height: 52, borderRadius: 30, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  cancelText:     { fontSize: 15, fontWeight: '600', color: C.dark },
  doneBtn:        { flex: 1, height: 52, borderRadius: 30, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  doneText:       { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
