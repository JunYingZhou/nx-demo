import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
 
export function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
 
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
 
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    // 处理扫描到的二维码数据
    alert(`扫描到的数据类型：${type}，数据内容：${data}`);
  };
 
  if (hasPermission === null) {
    return <Text>请求相机权限中...</Text>;
  }
  if (hasPermission === false) {
    return <Text>未获得相机权限</Text>;
  }
 
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="重新扫描" onPress={() => setScanned(false)} />
      )}
      {scannedData && <Text>扫描到的数据：{scannedData}</Text>}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});