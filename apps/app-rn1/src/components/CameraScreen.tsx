// components/CameraScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const CameraScreen = ({onClose}: {onClose: () => void}) => {
  const camera = useRef<Camera>(null);
  const devices: any = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status: any = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  if (!device) return <Text>加载摄像头中...</Text>;
  if (!hasPermission) return <Text>没有摄像头权限</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{color: '#fff'}}>关闭</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  closeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#d31145',
    padding: 12,
    borderRadius: 8,
  },
});

export default CameraScreen;
