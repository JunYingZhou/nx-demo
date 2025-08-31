import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

export function CameraScreen() {
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [recording, setRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [action, setAction] = useState('picture');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    console.log('action useEffect', action);
  }, [action]);

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
      setAction('picture');
      cameraRef.current.mode = 'picture';
      const photo = await cameraRef.current.takePictureAsync();
      Alert.alert('拍照成功', photo.uri);
      console.log('Photo:', photo);
    } catch (err) {
      console.error('拍照失败', err);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    if (!cameraReady) {
      Alert.alert('等待摄像头准备完成');
      return;
    }
    setRecording(true);
    await setAction('video');
    cameraRef.current.mode = 'video';

    
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
      setVideoUri(video.uri);
      Alert.alert('录像完成', video.uri);
    } catch (error) {
      console.error('录像失败', error);
      Alert.alert('录像失败', `${error}`);
    } finally {
      setRecording(false);
      cameraRef.current.mode = 'picture';
    }
  };
  
  

  const stopRecording = () => {
    if (cameraRef.current && recording) {
      cameraRef.current.stopRecording();
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
        onCameraReady={() => setCameraReady(true)}
        onBarCodeScanned={(result) => {
          Alert.alert('扫码成功', `类型: ${result.type}\n内容: ${result.data}`);
          console.log(result);
          // setScanning(false); // 可以暂时不关闭扫码，便于连续测试
        }}
      />
    ) : (
      <CameraView
        mode={action}
        style={{ flex: 1 }}
        facing={cameraType}
        ref={cameraRef}
        onCameraReady={() => setCameraReady(true)}
      />
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
