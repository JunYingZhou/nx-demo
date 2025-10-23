import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NAVIGATION as NAVIGATION_CONSTANTS } from '../constants/navigation';
import SignInScreen from '../screens/SignInScreen';
import SignInPhone from '../screens/SignInPhone';
import ValidCodeScreen from '../screens/ValidCodeScreen';




const Stack = createNativeStackNavigator();

const SignNavigator = () => {

  const defaultScreenOptions = () => ({
    headerShown: false,
  });
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION_CONSTANTS.SignIn} component={SignInScreen} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.SignInPhone} component={SignInPhone} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.ValidCode} component={ValidCodeScreen} options={defaultScreenOptions}/>
    </Stack.Navigator>
  );
}

export default SignNavigator;