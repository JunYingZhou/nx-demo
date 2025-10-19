import React from 'react';
import {Text, View} from 'react-native';
import {NAVIGATION} from '../constants/navigation';
import SignInScreen from '../screens/SignInScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={SignInScreen}
        name={NAVIGATION.login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;