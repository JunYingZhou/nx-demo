import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NAVIGATION as NAVIGATION_CONSTANTS } from '../constants/navigation';
import SignInScreen from '../screens/SignInScreen';




const Stack = createNativeStackNavigator();

const HomeNavigator = () => {

  const defaultScreenOptions = () => ({
    headerShown: false,
  });
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION_CONSTANTS.SignIn} component={SignInScreen} options={defaultScreenOptions}/>
    </Stack.Navigator>
  );
}

export default HomeNavigator;