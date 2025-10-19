import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

const Camera1 = () => {
  const camera = useRef<Camera | null>(null);
  const device = useCameraDevice('back');
  const [permission, setPermission] = useState(false);
  const [mode, setMode] = useState<'photo' | 'scan' | 'video'>('scan');
  const [isRecording, setIsRecording] = useState(false);
  const [lastCode, setLastCode] = useState('');
  const [lineAnim] = useState(new Animated.Value(0));

  // === 请求相机权限 ===
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status === 'granted');
    })();
  }, []);

  // === 扫码动画效果 ===
  useEffect(() => {
    if (mode !== 'scan') return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [mode]);

  // === 拍照 ===
  const takePhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({ flash: 'on' });
      Alert.alert('📸 拍照成功', JSON.stringify(photo, null, 2));
    } catch (error) {
      console.error('拍照失败:', error);
    }
  };

  // === 录像 ===
  const recordVideo = async () => {
    if (!camera.current) return;
    if (isRecording) {
      camera.current.stopRecording();
      return;
    }

    try {
      setIsRecording(true);
      await camera.current.startRecording({
        flash: 'off',
        onRecordingFinished: (video) => {
          setIsRecording(false);
          Alert.alert('🎬 录制完成', JSON.stringify(video, null, 2));
        },
        onRecordingError: (error) => {
          console.error(error);
          setIsRecording(false);
        },
      });

      // 自动 10 秒后停止
      setTimeout(() => {
        camera.current?.stopRecording();
      }, 10000);
    } catch (e) {
      console.error('录像失败:', e);
      setIsRecording(false);
    }
  };

  // === 扫码 ===
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      const code = codes[0]?.value;
      if (code && code !== lastCode) {
        setLastCode(code);
        Alert.alert('扫码成功', code);
        setTimeout(() => setLastCode(''), 2500); // 2.5秒防抖
      }
    },
  });

  // === 模式切换 ===
  const switchMode = (newMode: 'photo' | 'scan' | 'video') => {
    if (isRecording) {
      camera.current?.stopRecording();
      setIsRecording(false);
    }
    setMode(newMode);
  };

  if (!device)
    return (
      <View style={styles.center}>
        <Text>正在加载摄像头...</Text>
      </View>
    );

  if (!permission)
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={() => Camera.requestCameraPermission()}>
          <Text style={styles.permissionText}>请求相机权限</Text>
        </TouchableOpacity>
      </View>
    );

  // 扫码线动画位置
  const lineTranslate = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={mode === 'photo'}
        video={mode === 'video'}
        codeScanner={mode === 'scan' ? codeScanner : undefined}
      />

      {/* 扫码模式动画框 */}
      {mode === 'scan' && (
        <View style={styles.scanBox}>
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: lineTranslate }] },
            ]}
          />
        </View>
      )}

      {/* 顶部提示 */}
      <View style={styles.topBar}>
        <Text style={styles.modeText}>
          当前模式：
          {mode === 'photo' ? '📷 拍照' : mode === 'scan' ? '🔍 扫码' : '🎥 录像'}
        </Text>
        {isRecording && <Text style={styles.recording}>● 正在录像...</Text>}
      </View>

      {/* 底部控制栏 */}
      <View style={styles.bottomBar}>
        {['scan', 'photo', 'video'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeButton,
              mode === m && styles.modeButtonActive,
            ]}
            onPress={() => switchMode(m as any)}>
            <Text style={styles.modeText}>
              {m === 'scan' ? '扫码' : m === 'photo' ? '拍照' : '录像'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 拍摄 / 录制按钮 */}
      <View style={styles.actionBar}>
        {mode === 'photo' && (
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />
        )}
        {mode === 'video' && (
          <TouchableOpacity
            style={[
              styles.captureBtn,
              isRecording && styles.captureBtnRecording,
            ]}
            onPress={recordVideo}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// === 样式 ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permissionBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  permissionText: { color: '#fff', fontSize: 16 },
  topBar: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 12,
  },
  modeText: { color: '#fff', fontSize: 16 },
  recording: { color: 'red', fontWeight: 'bold', marginTop: 4 },
  bottomBar: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  modeButtonActive: { backgroundColor: '#007AFF' },
  actionBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  captureBtnRecording: { backgroundColor: 'red' },

  // 扫码框
  scanBox: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: 250,
    height: 250,
    borderColor: '#00FF00',
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00FF00',
  },
});

export default Camera1;
