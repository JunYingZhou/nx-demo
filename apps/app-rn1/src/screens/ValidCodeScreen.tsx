import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION as NAVIGATION_CONSTANTS } from "../constants/navigation";
// import PushNotification from "react-native-push-notification";

const ValidCodeScreen = ({ route }) => {
  const { phoneCode } = route.params;
  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRef = useRef<TextInput>(null);

  // 倒计时
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    PushNotificationF()
  }, [])

  const handleChange = (text: string) => {
    if (text.length <= 6) setCode(text);
    if (text.length === 6) {
      console.log("输入完成验证码:", text);
      // 可在这里发请求验证验证码
    }
  };

  // const PushNotificationF = () => {
  //   PushNotification.localNotification({
  //     channelId: "default-channel-id",
  //     title: "Hello",
  //     message: "This is a local notification",
  //   });
  // }

  const nextStep = () => {
    if (code.length < 6) {
      Alert.alert("提示", "请输入6位验证码");
      return;
    }
    navigation.navigate(NAVIGATION_CONSTANTS.NextStep);
  };

  const resendCode = () => {
    if (timer > 0) return;
    setTimer(60);
    Alert.alert("提示", "验证码已重新发送");

    setTimeout(() => {
      PushNotificationF()
    }, 2000)
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* 返回按钮 */}
        <View style={styles.backImage}>
          <Pressable onPress={navigation.goBack}>
            <ImageBackground
              style={{ width: 30, height: 30, marginTop: 10 }}
              source={require("../assets/image/back.png")}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        {/* 验证码输入 */}
        <View style={styles.phoneInput}>
          <Text style={styles.Txt1}>请输入验证码</Text>
          <Text style={styles.Txt2}>验证码已发送至 {phoneCode}</Text>

          {/* 点击方格聚焦输入 */}
          <Pressable onPress={() => inputRef.current?.focus()}>
            <View style={styles.codeContainer}>
              {Array(6)
                .fill(0)
                .map((_, i) => {
                  const char = code[i] || "";
                  const isActive = i === code.length;
                  return (
                    <View
                      key={i}
                      style={[styles.codeBox, isActive && styles.activeBox]}
                    >
                      <Text style={styles.codeText}>{char}</Text>
                    </View>
                  );
                })}
            </View>
          </Pressable>

          {/* 隐藏的真实输入框 */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            value={code}
            onChangeText={handleChange}
            maxLength={6}
            autoFocus
          />

          {/* 重新发送验证码 */}
          <View style={styles.resendContainer}>
            <Text style={styles.grayText}>没有收到验证码？ </Text>
            <Pressable onPress={resendCode} disabled={timer > 0}>
              <Text
                style={[
                  styles.resendText,
                  { color: timer > 0 ? "#ccc" : "#007AFF" },
                ]}
              >
                {timer > 0 ? `重新发送 (${timer}s)` : "重新发送"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 下一步按钮 */}
        <View style={styles.btn}>
          <AnimatedButton
            text="下一步"
            color="black"
            textColor="#fff"
            borderColor=""
            width="300"
            height="45"
            borderRadius={20}
            delay={400}
            onPress={nextStep}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ValidCodeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  backImage: { width: "100%", height: 200, paddingLeft: 20 },
  phoneInput: { width: "90%" },
  Txt1: { fontSize: 22, fontWeight: "bold", letterSpacing: 2 },
  Txt2: { color: "gray", fontSize: 15, marginTop: 10, marginBottom: 30 },
  codeContainer: { flexDirection: "row", justifyContent: "space-between", width: "95%", alignSelf: "center" },
  codeBox: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  activeBox: { borderColor: "#007AFF" },
  codeText: { fontSize: 24, fontWeight: "bold" },
  hiddenInput: { position: "absolute", opacity: 0 },
  resendContainer: { marginTop: 25, flexDirection: "row", alignItems: "center" },
  grayText: { color: "gray", fontSize: 14 },
  resendText: { fontSize: 14, fontWeight: "600" },
  btn: { width: "100%", alignItems: "center", justifyContent: "center", marginTop: 80 },
});
