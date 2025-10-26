import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { StyleSheet, useColorScheme, View, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



// Components
import TabBarIcon from '../components/TabBarIcon';
import MyNavigator from './MyNavigator';
import HomeNavigator from './HomeNavigator';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // const { colors } = useTheme();

  const isDarkMode = useColorScheme() === 'dark';

  // 获取顶部安全区域
  // const insets = useSafeAreaInsets();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
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
    // <SafeAreaView
    //             style={{
    //               flex: 1,
    //             }}
    //           >
    <View style={{ 
      // paddingTop: statusBarHeight,
       flex: 1,
    backgroundColor: '#fff' }}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="My" component={MyNavigator} />
        <Tab.Screen name="My1" component={MyNavigator} />
      </Tab.Navigator>
      
    </View>
      // </SafeAreaView>
    // <NavigationContainer>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})

export default AppNavigator;