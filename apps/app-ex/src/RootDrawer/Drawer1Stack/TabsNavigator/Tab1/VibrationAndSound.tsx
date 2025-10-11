import { Vibration } from 'react-native';
import { View, Text, Button } from 'react-native';
// import Sound from 'react-native-sound';
import { NativeModules } from 'react-native';
export function VibrationAndSoundScreen() {

  const vibration = () => {
    Vibration.vibrate(); // 默认震动 400ms
    console.log('震动', NativeModules);
  }


  const vibrationPattern = () => {
    Vibration.vibrate([500, 1000, 500, 2000]); // 自定义震动
  }

  const vibrationDuration = () => {
    Vibration.vibrate(1000, true); // 持续震动
  }
  
  const vibrationPatternDuration = () => {
    Vibration.vibrate(1000, true, (pattern) => {
      console.log('震动模式:', pattern);
    });
  }
  
  
  const vibrationPatternDurationCallback = () => {
    Vibration.vibrate(1000, true, (pattern) => {
      console.log('震动模式:', pattern);
    });
  }

  const startAlert = () => {
    // 开启震动
    Vibration.vibrate([500, 1000], true);
  
    // 播放铃声
    // const ring = new Sound(require('./test.mp3'), (error) => {
    //   if (!error) ring.play();
    // });
  
    return () => {
      // 停止所有
      Vibration.cancel();
      // ring.stop();
      // ring.release();
    };
  };

  const stopAlert = () => {
    Vibration.cancel();
    // ring.stop();
    // ring.release();
  };


  return (
    <View>
      <Text>VibrationAndSound</Text>
      <Button title="震动" onPress={vibration} />
      <Button title="震动模式" onPress={vibrationPattern} />
      <Button title="震动时长" onPress={vibrationDuration} />
      <Button title="震动模式和时长" onPress={vibrationPatternDuration} />
      <Button title="震动模式和时长回调" onPress={vibrationPatternDurationCallback} />
      <Button title="开启震动和铃声" onPress={startAlert} />
      <Button title="结束震动和铃声" onPress={stopAlert} />
    </View>
  );
  
  
}