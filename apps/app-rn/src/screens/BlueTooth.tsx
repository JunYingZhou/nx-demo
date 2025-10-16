import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();
const BlueTooth = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);

  // ✅ 请求权限（Android）
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }

  // ✅ 扫描设备
  const scanDevices = async () => {
    await requestPermissions();
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('Scan error:', error);
        return;
      }

      if (device?.name) {
        setDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [...prev, device];
        });
      }
    });

    // 10秒后停止扫描
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  // ✅ 连接设备
  const connectToDevice = async (device: any) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      alert(`已连接到 ${device.name}`);
    } catch (err) {
      console.error('连接失败:', err);
    }
  };

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="扫描蓝牙设备" onPress={scanDevices} />

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Button
            title={`${item.name} (${item.id})`}
            onPress={() => connectToDevice(item)}
          />
        )}
      />

      {connectedDevice && <Text>已连接设备: {connectedDevice.name}</Text>}
    </View>
  );
}

export default BlueTooth;