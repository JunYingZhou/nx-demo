import AppNavigator from "./AppNavigator"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAVIGATION as NAVIGATION_CONSTANTS } from '../constants/navigation';
import MyScreen from "../screens/MyScreen";

const Stack = createNativeStackNavigator();

const MyNavigator = () => {
  const defaultScreenOptions = () => ({
    headerShown: false,
  });
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION_CONSTANTS.home} component={MyScreen} options={defaultScreenOptions}/>    
    </Stack.Navigator>
  );
    
}

export default MyNavigator