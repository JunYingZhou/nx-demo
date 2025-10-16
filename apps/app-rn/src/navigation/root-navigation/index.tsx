import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import useUserStore from '../../store/useUserStore';
import AppNavigator from '../app-navigation/index';
import { theme } from '../../thmem/index';

export default function Index()  {
    const { user, setUser, clearUser } = useUserStore();
    const scheme = useColorScheme() || 'light';
    return (
      <NavigationContainer theme={theme[scheme]}>
        {/* {user ? <AppNavigator /> : <AuthNavigator />} */}
        <AppNavigator />
      </NavigationContainer>
    );
  }

export default Index;
  