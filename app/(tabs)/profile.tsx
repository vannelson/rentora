import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../../lib/design';
import { useAuthStore } from '../../stores/auth.store';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const GENERAL_ITEMS: { icon: IoniconName; label: string }[] = [
  { icon: 'heart-outline',       label: 'Favorite Cars' },
  { icon: 'time-outline',        label: 'Previous Rent' },
  { icon: 'notifications-outline', label: 'Notification' },
  { icon: 'link-outline',        label: 'Connected to GENT Partnerships' },
];

const SUPPORT_ITEMS: { icon: IoniconName; label: string }[] = [
  { icon: 'settings-outline',       label: 'Settings' },
  { icon: 'language-outline',       label: 'Languages' },
  { icon: 'person-add-outline',     label: 'Invite Friends' },
  { icon: 'document-text-outline',  label: 'Privacy policy' },
  { icon: 'help-circle-outline',    label: 'Help Support' },
];

function MenuItem({ icon, label, onPress }: { icon: IoniconName; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={s.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={s.menuIcon}>
        <Ionicons name={icon} size={19} color={C.dark} />
      </View>
      <Text style={s.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={C.muted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, reset, setLoggedIn } = useAuthStore();

  function handleLogout() {
    reset();
    setLoggedIn(false);
    router.replace('/welcome');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={C.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={C.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Avatar + info */}
        <View style={s.avatarRow}>
          <View style={s.avatarCircle}>
            <Ionicons name="person" size={38} color="#9CA3AF" />
          </View>
          <View style={s.avatarInfo}>
            <Text style={s.userName}>{profile?.full_name ?? 'Benjamin Jack'}</Text>
            <Text style={s.userEmail}>{profile?.email ?? 'benjaminjack@gmail.com'}</Text>
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Ionicons name="create-outline" size={15} color={C.dark} />
            <Text style={s.editText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* General */}
        <Text style={s.sectionTitle}>General</Text>
        <View style={s.menuCard}>
          {GENERAL_ITEMS.map((item, i) => (
            <View key={item.label}>
              <MenuItem icon={item.icon} label={item.label} />
              {i < GENERAL_ITEMS.length - 1 && <View style={s.itemDivider} />}
            </View>
          ))}
        </View>

        {/* Support */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Support</Text>
        <View style={s.menuCard}>
          {SUPPORT_ITEMS.map((item, i) => (
            <View key={item.label}>
              <MenuItem icon={item.icon} label={item.label} />
              {i < SUPPORT_ITEMS.length - 1 && <View style={s.itemDivider} />}
            </View>
          ))}
          <View style={s.itemDivider} />
          <MenuItem icon="log-out-outline" label="Log out" onPress={handleLogout} />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: C.border },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.dark },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  avatarCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  avatarInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: C.dark, marginBottom: 3 },
  userEmail: { fontSize: 12, color: C.muted },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { fontSize: 12, fontWeight: '600', color: C.dark },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.dark, marginBottom: 12 },
  menuCard: { backgroundColor: '#FFF', borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuIcon: { width: 32, alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 14, color: C.dark, fontWeight: '500' },
  itemDivider: { height: 1, backgroundColor: C.border, marginLeft: 48 },
});
