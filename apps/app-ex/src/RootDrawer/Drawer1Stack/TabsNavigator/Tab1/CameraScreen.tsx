import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

export function CameraScreen() {
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) return <Text>请求相机权限中...</Text>;
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>需要相机权限</Text>
        <Button title="授予权限" onPress={requestPermission} />
      </View>
    );

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      Alert.alert('拍照成功', photo.uri);
      console.log('Photo:', photo);
    } catch (err) {
      console.error('拍照失败', err);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setRecording(true);
    try {
      const video = await cameraRef.current.recordAsync();
      Alert.alert('录像完成', video.uri);
      console.log('Video:', video);
    } catch (err) {
      console.error('录像失败', err);
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && recording) {
      cameraRef.current.stopRecording();
      setRecording(false);
    }
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    Alert.alert('扫码成功', `类型: ${result.type}\n内容: ${result.data}`);
    console.log('Scanned:', result);
    setScanning(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {scanning ? (
        <CameraView
          style={{ flex: 1 }}
          facing={cameraType}
          onBarCodeScanned={handleBarCodeScanned}
        />
      ) : (
        <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef} />
      )}

      <View style={styles.controls}>
        <Button title="切换相机" onPress={toggleCameraType} />
        <Button title="拍照" onPress={takePicture} />
        {recording ? (
          <Button title="停止录像" onPress={stopRecording} color="red" />
        ) : (
          <Button title="开始录像" onPress={startRecording} />
        )}
        <Button title="扫码" onPress={() => setScanning(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
