import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false); // 是否扫码模式
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // 请求权限
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const audio = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === 'granted' && audio.status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>请求权限中...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>没有相机权限</Text></View>;
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      Alert.alert("拍照成功", `照片路径: ${photo.uri}`);
      console.log('Photo:', photo);
    }
  };

  const handleRecordVideo = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        Alert.alert("录像完成", `视频路径: ${video.uri}`);
        console.log('Video:', video);
      }
    }
  };

  const handleScanQRCode = () => {
    setScanning(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    Alert.alert("二维码内容", data);
    console.log(`Scanned QR code with type ${type} and data ${data}`);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef} />
      )}

      <View style={styles.controls}>
        <Button title="拍照" onPress={handleTakePhoto} />
        <Button title={isRecording ? "停止录像" : "开始录像"} onPress={handleRecordVideo} />
        <Button title="扫码" onPress={handleScanQRCode} />
        <Button title="返回" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
