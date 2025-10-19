import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// 定义设备类型接口
interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
}

const manager = new BleManager();

const BlueTooth = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

  // 请求权限（Android）
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const allGranted = Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            '权限被拒绝',
            '需要蓝牙和位置权限才能扫描设备',
            [{ text: '确定' }]
          );
          return false;
        }
      } catch (error) {
        console.error('权限请求错误:', error);
        return false;
      }
    }
    return true;
  }

  // 扫描设备
  const scanDevices = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setIsScanning(true);
    setScanCountdown(10);

    // 开始扫描计时
    const timer = setInterval(() => {
      setScanCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      manager.startDeviceScan(
        null,
        null,
        (error, device) => {
          if (error) {
            console.warn('扫描错误:', error);
            Alert.alert('扫描失败', '无法扫描蓝牙设备，请检查蓝牙设置');
            stopScan();
            return;
          }

          if (device?.name) {
            setDevices((prev) => {
              if (prev.find((d) => d.id === device.id)) {
                // 更新已存在设备的信号强度
                return prev.map((d) =>
                  d.id === device.id ? { ...d, rssi: device.rssi } : d
                );
              }
              return [...prev, { id: device.id, name: device.name, rssi: device.rssi }];
            });
          }
        }
      );

      // 10秒后停止扫描
      setTimeout(() => {
        stopScan();
      }, 10000);
    } catch (error) {
      console.error('扫描过程错误:', error);
      stopScan();
    }
  };

  // 停止扫描
  const stopScan = () => {
    setIsScanning(false);
    setScanCountdown(0);
    manager.stopDeviceScan();
  };

  // 连接设备
  const connectToDevice = async (device: BluetoothDevice) => {
    setConnectionStatus('connecting');
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
      setConnectionStatus('connected');
      Alert.alert('连接成功', `已连接到 ${device.name}`);
    } catch (err) {
      console.error('连接失败:', err);
      setConnectionStatus('idle');
      Alert.alert('连接失败', `无法连接到 ${device.name}`);
    }
  };

  // 断开连接
  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        setConnectionStatus('idle');
        Alert.alert('断开连接', '已断开与设备的连接');
      } catch (err) {
        console.error('断开连接失败:', err);
        Alert.alert('断开失败', '无法断开连接');
      }
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  // 渲染设备项
  const renderDeviceItem = ({ item }: { item: BluetoothDevice }) => {
    // 根据信号强度计算信号质量
    const getSignalQuality = (rssi?: number) => {
      if (rssi === undefined) return '未知';
      if (rssi > -50) return '很好';
      if (rssi > -70) return '良好';
      if (rssi > -90) return '一般';
      return '较弱';
    };

    const getSignalColor = (rssi?: number) => {
      if (rssi === undefined) return '#999';
      if (rssi > -50) return '#4CAF50';
      if (rssi > -70) return '#8BC34A';
      if (rssi > -90) return '#FFC107';
      return '#FF5252';
    };

    return (
      <View style={styles.deviceItem}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name || '未知设备'}</Text>
          <View style={styles.deviceMeta}>
            <Text style={styles.deviceId} numberOfLines={1}>
              {item.id}
            </Text>
            <Text style={[styles.signalQuality, { color: getSignalColor(item.rssi) }]}>
              信号: {getSignalQuality(item.rssi)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.connectButton,
            connectionStatus === 'connecting' && styles.disabledButton,
          ]}
          onPress={() => connectToDevice(item)}
          disabled={connectionStatus === 'connecting'}
        >
          {connectionStatus === 'connecting' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.connectButtonText}>连接</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>蓝牙设备管理</Text>
      </View>

      {/* 连接状态显示 */}
      {connectedDevice && (
        <View style={styles.connectedStatus}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>已连接: {connectedDevice.name}</Text>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={disconnectDevice}
          >
            <Text style={styles.disconnectButtonText}>断开</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 扫描按钮 */}
      <View style={styles.scanContainer}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanningButton]}
          onPress={isScanning ? stopScan : scanDevices}
          activeOpacity={0.8}
        >
          {isScanning ? (
            <View style={styles.scanButtonContent}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.scanButtonText}>扫描中 ({scanCountdown}s)</Text>
            </View>
          ) : (
            <Text style={styles.scanButtonText}>扫描设备</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 设备列表 */}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.deviceList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isScanning ? '正在扫描设备...' : '暂无设备，请点击扫描'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e9',
    margin: 16,
    borderRadius: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  scanContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scanningButton: {
    backgroundColor: '#1976D2',
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deviceList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  signalQuality: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default BlueTooth;