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
  { key: "camera", title: "相机\n拍照/录像/扫码" },
  { key: "album", title: "相册 / 文件" },
  { key: "mic", title: "麦克风" },
  { key: "gps", title: "定位 / GPS" },
  { key: "sensor", title: "传感器" },
  { key: "bluetooth", title: "蓝牙" },
  { key: "nfc", title: "NFC" },
  { key: "biometric", title: "指纹 / FaceID" },
  { key: "vibration", title: "震动" },
  { key: "battery", title: "电池 & 网络" },
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
        navigation.navigate("HomeDetail", { feature: item.key });
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
