// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';

// const manager = new BleManager();

// export function BluetoothScreen() {
//   const [devices, setDevices] = useState<any[]>([]);
//   const [scanning, setScanning] = useState(false);

//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       ]);
//     }
//   }, []);

//   const scanDevices = () => {
//     setScanning(true);
//     setDevices([]);

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error(error);
//         setScanning(false);
//         return;
//       }
//       if (device && !devices.find(d => d.id === device.id)) {
//         setDevices(prev => [...prev, device]);
//       }
//     });

//     // Stop scanning after 10 seconds
//     setTimeout(() => {
//       manager.stopDeviceScan();
//       setScanning(false);
//     }, 10000);
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="扫描蓝牙设备" onPress={scanDevices} disabled={scanning} />
//       {devices.map(d => (
//         <Text key={d.id}>{d.name || '未知设备'} ({d.id})</Text>
//       ))}
//     </View>
//   );
// }
