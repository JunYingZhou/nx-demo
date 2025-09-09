import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export function MicrophoneScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // 开始录音
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('需要麦克风权限');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('开始录音...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('录音出错:', err);
    }
  };

  // 停止录音
  const stopRecording = async () => {
    if (!recording) return;
    console.log('停止录音...');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri || null);
    setRecording(null);
    console.log('录音文件路径:', uri);
  };

  // 播放录音
  const playRecording = async () => {
    if (!recordingUri) return;
    try {
      console.log('播放录音...');
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
    } catch (err) {
      console.error('播放出错:', err);
    }
  };

  // 停止播放
  const stopPlaying = async () => {
    if (!sound) return;
    console.log('停止播放...');
    await sound.stopAsync();
    setSound(null);
    setIsPlaying(false);
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        🎤 麦克风功能
      </Text>

      {/* 录音按钮 */}
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: 'blue', borderRadius: 8 }}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {isRecording ? '停止录音' : '开始录音'}
        </Text>
      </TouchableOpacity>

      {/* 播放按钮 */}
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: 'green', borderRadius: 8 }}
        onPress={isPlaying ? stopPlaying : playRecording}
        disabled={!recordingUri}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {isPlaying ? '停止播放' : '播放录音'}
        </Text>
      </TouchableOpacity>

      {/* 显示录音文件路径 */}
      {recordingUri && (
        <Text style={{ fontSize: 12, color: 'gray', marginTop: 8 }}>
          文件路径: {recordingUri}
        </Text>
      )}
    </View>
  );
}
