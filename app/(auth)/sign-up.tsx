import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../../lib/design';
import { useAuthStore } from '../../stores/auth.store';

export default function SignUpScreen() {
  const router = useRouter();
  const { setLoggedIn, setProfile } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSignUp() {
    setProfile({
      id: 'mock-user',
      email: email || 'demo@rentora.app',
      full_name: fullName || 'New User',
      created_at: new Date().toISOString(),
    });
    setLoggedIn(true);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.brandName}>Rentora</Text>
          </View>
          <Text style={styles.pageTitle}>Sign Up</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={C.muted} value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={C.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <View style={{ position: 'relative' }}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor={C.muted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={C.muted} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Country" placeholderTextColor={C.muted} value={country} onChangeText={setCountry} />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/login')} activeOpacity={0.85}>
              <Text style={styles.secondaryBtnText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Ionicons name="logo-apple" size={18} color={C.dark} />
              <Text style={styles.socialText}>Apple pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Ionicons name="logo-google" size={18} color={C.dark} />
              <Text style={styles.socialText}>Google Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerRow} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Login.</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, marginBottom: 24 },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '700', color: C.dark },
  pageTitle: { fontSize: 24, fontWeight: '800', color: C.dark, textAlign: 'center', marginBottom: 28 },
  form: { gap: 12 },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 30, height: 54, paddingHorizontal: 20, fontSize: 15, color: C.dark },
  eyeBtn: { position: 'absolute', right: 18, top: 18 },
  primaryBtn: { backgroundColor: C.dark, borderRadius: 30, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { backgroundColor: C.lightBtn, borderRadius: 30, height: 54, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: C.dark, fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.muted, fontSize: 13 },
  socialBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 30, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  socialText: { fontSize: 15, fontWeight: '600', color: C.dark },
  footerRow: { alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: C.muted },
  footerLink: { color: C.dark, fontWeight: '700' },
});
