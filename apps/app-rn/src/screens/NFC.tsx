import { View, Text, Alert, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import NFCService from '../utils/NFCServices';
import NfcManager from 'react-native-nfc-manager';

const NFC = () => {
  const [status, setStatus] = useState<any>('');

  useEffect(() => {
    (async () => {
      const s = await NFCService.init();
      setStatus(s);
      // ✅ 启动持续监听
      startListen();
    })();

    // ✅ 卸载时停止监听
    return () => {
      NFCService.stopListening();
    };
  }, []);

  const readOnce = async () => {
    try {
      const { tag, text } = await NFCService.readNdefOnce();
      Alert.alert('读取到tag', JSON.stringify(tag));
      if (text) Alert.alert('解析文本', text);
    } catch (e: any) {
      Alert.alert('读取失败', e.message || String(e));
    }
  };

  const writeExample = async () => {
    try {
      await NFCService.writeText('Hello from RN');
      Alert.alert('写入成功');
    } catch (e: any) {
      Alert.alert('写入失败', e.message || String(e));
    }
  };

  // ✅ 持续监听逻辑
  const startListen = async () => {
    try {
      // 注册 DiscoverTag 事件（每次检测到标签时触发）
      NfcManager.setEventListener(NfcManager.EVENTS.DiscoverTag, tag => {
        console.log('📡 监听到 Tag:', tag);
        Alert.alert('监听到 tag', JSON.stringify(tag));
        // ⚠️ 若不调用 setAlertMessage / cancelTechnologyRequest
        // 会持续触发，每次靠近都会回调
      });

      // 注册监听事件（App 前台时生效）
      await NfcManager.registerTagEvent();
      console.log('✅ NFC 正在监听...');
    } catch (ex) {
      console.warn('监听失败', ex);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 20, color: 'red' }}>
        支持: {String(status.isSupported)}
      </Text>
      <Text style={{ fontSize: 20, color: 'red' }}>
        已开启: {String(status.isEnabled)}
      </Text>
      <Button title="读一次 NDEF" onPress={readOnce} />
      <Button title="写入文本到 tag" onPress={writeExample} />
      <Button title="开始持续监听" onPress={startListen} />
    </View>
  );
};

export default NFC;
