import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';

// Screens
// import Home from '../screens/Home';
// import Ticket from '../screens/Ticket';
// import My from '../screens/My';
// import EventList from '../screens/EventList';


// Components
import TabBarIcon from '../components/TabBarIcon';
// import TicketNavigator from './TicketNavigator';
import HomeNavigator from './HomeNavigation';
// import MyNavigator from './MyNavigator';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // const { colors } = useTheme();

  const isDarkMode = useColorScheme() === 'dark';

  
  const screenOptions = ({
    route
  }: {
    route: { name: string };
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: '#E00842',
    tabBarInactiveTintColor:  '#8E8E93',
    tabBarIcon: ({ color }) => (
      <TabBarIcon color={color} name={route.name} />
    ),
    tabBarStyle: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderTopColor: 'transparent',
    }
  });
  return (
    // <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeNavigator} />
      </Tab.Navigator>
    // </NavigationContainer>
  );
};

export default AppNavigator;