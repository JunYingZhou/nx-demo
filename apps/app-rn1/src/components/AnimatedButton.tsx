import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import * as Animatable from "react-native-animatable";

/**
 * 可复用的动画按钮组件
 */
const AnimatedButton = ({
  text,
  color,
  borderColor,
  width = 300,
  height = 60,
  borderRadius = 15,
  textColor = "#fff",
  onPress,
  delay = 0,
  from = "none",
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translate = useRef(
    new Animated.Value(from === "right" ? 300 : from === "none" ? 0 : -200)
  ).current;

  useEffect(() => {
    if (from === "none") return;
    Animated.timing(translate, {
      toValue: 0,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [from]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }, { translateX: translate }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[
          styles.buttonBase,
          {
            width: typeof width === "number" ? width : width,
            height: typeof height === "number" ? height : height,
            borderRadius,
            backgroundColor: color,
            borderColor: color,
          },
          borderColor && styles.outlineButton,
        ]}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingLeft: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonBase: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", 
    // 立体阴影效果
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 3,
    fontFamily: "Anton",
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: "black",
    // backgroundColor: "transparent",
    shadowOpacity: 0.15,
  },
});


export default AnimatedButton;