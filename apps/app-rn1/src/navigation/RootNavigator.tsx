import SignInScreen from "../screens/SignInScreen";
import AppNavigator from "./AppNavigator"
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const RootNavigation = () => {

  const [isShow, setIsShow] = useState<boolean>(false)


        return (
          // <SafeAreaView
          //   style={{
          //     flex: 1,
          //   }}
          // >
            <NavigationContainer>
              {/* {user ? <AppNavigator /> : <AuthNavigator />} */}
              { 
                isShow ? <AppNavigator /> : <SignInScreen/>
              }
            </NavigationContainer>
          // </SafeAreaView>
        );
    
}

export default RootNavigation