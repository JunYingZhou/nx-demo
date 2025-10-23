import SignInScreen from "../screens/SignInScreen";
import AppNavigator from "./AppNavigator"
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const RootNavigation = () => {

  // const [isShow, setIsShow] = useState<boolean>(false)


        return (

          
              <AppNavigator/>
          // <SafeAreaView
          //   style={{
          //     flex: 1,
          //   }}
          // >
            // <NavigationContainer>
          // </SafeAreaView>
        );
    
}

export default RootNavigation