import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION as NAVIGATION_CONSTANTS } from "../constants/navigation";
import { useState } from "react";
const SignInPhone = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  // 校验规则（中国大陆手机号）
  const phoneRegex = /^1[3-9]\d{9}$/;

  const nextStep = () => {
    if (!phone) {
      Alert.alert("提示", "请输入手机号");
      return;
    }

    
    const rawPhone = phone.replace(/-/g, "");


    if (!phoneRegex.test(rawPhone)) {
      Alert.alert("提示", "请输入正确的手机号");
      return;
    }

    // ✅ 校验通过
    navigation.navigate(NAVIGATION_CONSTANTS.ValidCode, {
      phoneCode: phone,
    });
  };

  // const nextStep = () => {
  //     navigation.navigate(NAVIGATION_CONSTANTS.ValidCode);
  // }

  const handleChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const formatPhone = (phone: string): string => {
    // 去掉非数字
    const digits = phone.replace(/\D/g, "");
    // 格式化 3-4-4
    let formatted = digits;

    if(formatted.length > 3 && formatted.length <= 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`
    } else if (formatted.length > 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7)}`
    }

    return formatted;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.container}>
        <View style={styles.backImage}>
          <Pressable onPress={navigation.goBack}>
            <ImageBackground
              style={{ width: 30, height: 30, marginLeft: 0, marginTop: 10 }}
              source={require("../assets/image/back.png")}
              resizeMode="cover"
            ></ImageBackground>
          </Pressable>
        </View>
        <View style={styles.phoneInput}>
          <Text style={styles.Txt1}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>+86 |</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号码"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={13}
              value={phone}
              onChangeText={handleChange}
            />
          </View>
        </View>

        <View style={styles.btn}>
          <AnimatedButton
            text="下一步"
            color="black"
            textColor="#fff"
            borderColor=""
            width="400"
            height="40"
            borderRadius={20}
            delay={400}
            onPress={() => {
              nextStep();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
  },
  backImage: {
    width: "100%",
    height: 200,
    paddingLeft: 20,
  },
  phoneInput: {
    width: "95%",
    flex: 1,
    paddingLeft: 20,
  },
  btn: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
  },
  inputWrapper: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 50,
    lineHeight: 50,
    width: "92%",
  },
  prefix: {
    fontSize: 16,
    color: "#000",
    marginRight: 5,
  },
  input: {
    flex: 1, // 让输入框自动填满剩余空间
    fontSize: 20,
    color: "#000",
    // lineHeight: 1,
  },
  Txt: {
    // textAlign: "center",
    lineHeight: 60,
    letterSpacing: 5,
    fontFamily: "Anton",
    fontWeight: "bold",
    fontSize: 15,
  },
  Txt1: {
    // textAlign: "center",
    lineHeight: 60,
    letterSpacing: 5,
    fontFamily: "Anton",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default SignInPhone;
