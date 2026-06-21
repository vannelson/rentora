import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LoadingScreen } from '../../components/LoadingScreen';
import { C } from '../../lib/design';
import { useAuthStore } from '../../stores/auth.store';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: { name: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { name: 'index',    icon: 'home-outline',         iconActive: 'home' },
  { name: 'bookings', icon: 'book-outline',          iconActive: 'book' },
  { name: 'calendar', icon: 'notifications-outline', iconActive: 'notifications' },
  { name: 'profile',  icon: 'person-outline',        iconActive: 'person' },
];

function FloatingTabBar({ state, navigation }: { state: any; navigation: any; descriptors: any }) {
  return (
    <View style={styles.tabBarWrapper} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TAB_CONFIG[index] ?? TAB_CONFIG[0];
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.icon}
                size={22}
                color={isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.dark,
    borderRadius: 40,
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
    gap: 4,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  tabItemActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
