import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import RootNavigator from '../navigation/root-navigation/index';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Platform } from 'react-native';
import { AMapSdk } from 'react-native-amap3d';
AMapSdk.init(Platform.select({
  android: 'e10d14fadb21e1cfdfa2d6a73041a81c',
  ios: 'e10d14fadb21e1cfdfa2d6a73041a81c',
}));
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'light';
  console.log('mode: ', isDarkMode)
  console.log('Platform: ', Platform.OS)
  console.log('StatusBar.currentHeight: ', StatusBar.currentHeight)
  console.log('backgroundStyle: ', Colors.lighter, Colors.darker)
  const statusBarHeight = getStatusBarHeight();
  console.log('StatusBar Height:', statusBarHeight);

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.lighter : Colors.darker,
    backgroundColor: '#d31145',
    flex: 1,
  };


  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#4CAF50',
          backgroundColor: '#f0f0f0',
          zIndex: 9999,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'black',
        }}
        text2Style={{
          fontSize: 14,
          color: 'gray',
        }}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#fff',
        }}
        text2Style={{
          fontSize: 16,
          color: '#eee',
        }}
        style={{
          backgroundColor: '#D32F2F',
          borderLeftColor: '#B71C1C',
        }}
      />
    ),
  };



  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundStyle.backgroundColor,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : statusBarHeight,
        }}
      >
        {/* <StatusBar
        // barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
        translucent={false}
      /> */}
        <StatusBar
          // animated={true}
          // hidden={false}
          // backgroundColor={backgroundStyle.backgroundColor}
          backgroundColor="transparent"
          translucent
          barStyle={isDarkMode ? 'dark-content' : 'light-content'}
          showHideTransition={'fade'}
          networkActivityIndicatorVisible={true}
        />
        {/* <SafeAreaView style={{flex: 1}}> */}
        <RootNavigator />
        {/* </SafeAreaView> */}
        <Toast config={toastConfig} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
