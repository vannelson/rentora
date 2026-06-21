import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.darkBg} />

      <View style={styles.carDecor}>
        <Ionicons name="car-sport-outline" size={200} color="rgba(255,255,255,0.05)" />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={22} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to{'\n'}Rentora</Text>
          <Text style={styles.heroSub}>Your premium car rental{'\n'}experience starts here</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D0D' },
  darkBg: { ...StyleSheet.absoluteFill, backgroundColor: '#0D0D0D' },
  carDecor: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  safe: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 28 },
  logoRow: { paddingTop: 16 },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { flex: 1, justifyContent: 'center' },
  heroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 52,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 26,
  },
  bottom: { paddingBottom: 32 },
  getStartedBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
