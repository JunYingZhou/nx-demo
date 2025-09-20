
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
// import { MapView, Marker } from "react-native-amap3d";
export function LocationAndMapScreen() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async() => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('权限被拒绝');
        return;
      }
    })()
  }, [])

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <style>html,body,#container{width:100%;height:100%;margin:0;padding:0;}</style>
        <script src="https://webapi.amap.com/maps?v=2.0&key=5b76d1ddf6de5a5d652e4928c7fc86ab"></script>
      </head>
      <body>
        <div id="container"></div>
        <script>
          var map = new AMap.Map("container", {
            zoom: 15,
            center: [116.397428, 39.90923]
          });
        </script>
      </body>
    </html>
  `;

  const getLocation = async () => {
    // 设置loading
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log('location', location);
    } catch (e) {
      setErrorMsg('获取位置失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="获取位置" onPress={getLocation} disabled={loading} />
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>正在获取位置...</Text>
        </View>
      )}
      <Text style={styles.text}>纬度: {location?.coords.latitude}</Text>
      <Text style={styles.text}>经度: {location?.coords.longitude}</Text>
      {errorMsg && <Text>{errorMsg}</Text>}
      {location && (
        <View style={styles.webviewWrap}>
          {/* <WebView
            originWhitelist={["*"]}
            source={{ html }}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            style={styles.webview}
          /> */}
          <WebView
            source={{ uri: 'https://m.amap.com/' }}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            geolocationEnabled
            style={styles.webview}
          />
        </View>
      )}
      {/* <MapView
        style={StyleSheet.absoluteFill}
        zoomLevel={15}
        coordinate={{ latitude: location?.coords.latitude, longitude: location?.coords.longitude }}
      >
        {location && (
        <Marker
          coordinate={{ latitude: location?.coords.latitude, longitude: location?.coords.longitude }}
          title="当前位置"
            description="北京"
          />
        )}
      </MapView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  webviewWrap: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: 800,
    height: 300,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});