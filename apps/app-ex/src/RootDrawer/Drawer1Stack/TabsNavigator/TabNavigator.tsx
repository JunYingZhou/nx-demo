import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTab } from './Tab1/HomeTab';
import { ProfileScreen } from './Tab2/ProfileScreen';
import { SettingsScreen } from './Tab3/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '../../../state/useNotificationStore';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
  const { homeCount, profileCount } = useNotificationStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'home' | 'home-outline' | "person" | 'settings' | 'person-outline' | 'settings-outline'  = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} options={{ tabBarBadge: homeCount > 0 ? homeCount : undefined }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarBadge: profileCount > 0 ? profileCount : undefined }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
