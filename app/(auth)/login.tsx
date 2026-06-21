import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../../lib/design';
import { useAuthStore } from '../../stores/auth.store';

export default function LoginScreen() {
  const router = useRouter();
  const { setLoggedIn, setProfile } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    setProfile({
      id: 'mock-user',
      email: email || 'demo@rentora.app',
      full_name: email ? email.split('@')[0] : 'Demo User',
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
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.title}>Ready to hit the road.</Text>
          </View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Email / Phone Number" placeholderTextColor={C.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <View style={{ position: 'relative', marginBottom: 4 }}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor={C.muted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={C.muted} />
              </TouchableOpacity>
            </View>
            <View style={styles.rememberRow}>
              <View style={styles.rememberLeft}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberText}>Remember Me</Text>
              </View>
              <TouchableOpacity><Text style={styles.forgotText}>Forgot Password</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/sign-up')} activeOpacity={0.85}>
              <Text style={styles.secondaryBtnText}>Sign up</Text>
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
            <TouchableOpacity style={styles.footerRow} onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink}>Sign Up.</Text></Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, marginBottom: 36 },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '700', color: C.dark },
  titleBlock: { marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', color: C.dark, lineHeight: 34 },
  form: { gap: 12 },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 30, height: 54, paddingHorizontal: 20, fontSize: 15, color: C.dark },
  eyeBtn: { position: 'absolute', right: 18, top: 18 },
  rememberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2 },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: C.dark, backgroundColor: C.card },
  rememberText: { fontSize: 13, color: C.mutedDark },
  forgotText: { fontSize: 13, color: C.dark, fontWeight: '600' },
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
