import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import useUserStore from '../store/useUserStore/index';
import AppNavigator from './AppNavigation';
import AuthNavigator from './AuthNavigator';
import { theme } from '../theme/index';

const RootNavigator = () =>  {
    const { user, setUser, clearUser } = useUserStore();
    const scheme = useColorScheme() || 'light';
    return (
      <NavigationContainer theme={theme[scheme]}>
        {user ? <AppNavigator /> : <AuthNavigator />}
        {/* <AppNavigator /> */}
      </NavigationContainer>
    );
  }

export default RootNavigator;
  