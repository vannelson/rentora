import { useRouter } from 'expo-router';
import { signInWithEmail, signOut, signUpWithEmail } from '../../../services/auth.service';
import { useAuthStore } from '../../../stores/auth.store';

export function useAuth() {
  const router = useRouter();
  const { isLoggedIn, profile, isLoading, setLoggedIn, setProfile, setLoading, reset } =
    useAuthStore();

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      setProfile(user);
      setLoggedIn(true);
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string, fullName: string) {
    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password, fullName);
      setProfile(user);
      setLoggedIn(true);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await signOut();
    reset();
    router.replace('/(auth)/login');
  }

  return { isLoggedIn, profile, isLoading, login, register, logout };
}
