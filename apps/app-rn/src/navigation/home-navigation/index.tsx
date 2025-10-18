import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Map from '../../screens/Map';  
import { NAVIGATION as NAVIGATION_CONSTANTS } from '../../constants/navigation';
import Home from '../../screens/Home';
import BlueTooth from '../../screens/BlueTooth';
import Hotel from '../../screens/Hotel';
import NFC from '../../screens/NFC';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {

  const defaultScreenOptions = () => ({
    headerShown: false,
  });
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION_CONSTANTS.home} component={Home} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.map} component={Map} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.Hotel} component={Hotel} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.nfc} component={NFC} options={defaultScreenOptions}/>
      <Stack.Screen name={NAVIGATION_CONSTANTS.blueTooth} component={BlueTooth} options={defaultScreenOptions}/>
    </Stack.Navigator>
  );
}

export default HomeNavigator;