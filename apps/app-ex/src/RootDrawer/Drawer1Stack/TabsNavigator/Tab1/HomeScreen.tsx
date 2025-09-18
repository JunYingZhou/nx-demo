import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  StyleSheet,
} from "react-native";

const features = [
  { key: "camera", title: "相机\n拍照/录像/扫码", screen: "Camera" },
  { key: "album", title: "相册 / 文件", screen: "Album" },
  { key: "Microphone", title: "麦克风", screen: "Microphone" },
  { key: "gps", title: "定位 / GPS", screen: "LocationAndMap" },
  { key: "sensor", title: "传感器", screen: "Sensor" },
  { key: "bluetooth", title: "蓝牙", screen: "Bluetooth" },
  { key: "nfc", title: "NFC" },
  { key: "biometric", title: "指纹 / FaceID", screen: "Biometric" },
  { key: "vibration", title: "震动", screen: "Vibration" },
  { key: "battery", title: "电池 & 网络", screen: "Battery" },
  { key: "notification", title: "提示", screen: "Notification" },
];

export function HomeScreen({ navigation }) {
  const colorScheme = useColorScheme(); // 👈 获取系统模式（light / dark）
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#000" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const cardColor = isDark ? "#222" : "#f5f5f5";

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={() => {
        // navigation.navigate(item.screen, { feature: item.key });
        navigation.navigate(item.screen);
      }}
    >
      <Text style={[styles.cardText, { color: textColor }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>功能入口</Text>
      <FlatList
        data={features}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
  },
});
